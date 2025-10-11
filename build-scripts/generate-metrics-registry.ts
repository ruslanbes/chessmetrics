#!/usr/bin/env ts-node

import * as fs from 'fs'
import * as path from 'path'
import * as glob from 'glob'

interface MetricInfo {
  name: string
  className: string
  category: string
  filePath: string
  importPath: string
  type: string
}

/**
 * Generate metrics registry by scanning the metrics directory
 */
function generateMetricsRegistry(): void {
  console.log('🔍 Scanning metrics directory...')
  
  const metricsDir = path.join(__dirname, '../src/metrics')
  const registryPath = path.join(__dirname, '../src/core/metric/MetricRegistry.ts')
  
  // Find all metric files (excluding test files)
  const metricFiles = glob.sync('**/*.ts', {
    cwd: metricsDir,
    ignore: ['**/*.test.ts', '**/README.md']
  })
  
  console.log(`📁 Found ${metricFiles.length} metric files`)
  
  const metrics: MetricInfo[] = []
  
  // Parse each metric file
  for (const file of metricFiles) {
    const fullPath = path.join(metricsDir, file)
    const content = fs.readFileSync(fullPath, 'utf-8')
    
    // Extract metric information
    const metricInfo = parseMetricFile(content, file, fullPath)
    if (metricInfo) {
      metrics.push(metricInfo)
      console.log(`  ✅ ${metricInfo.category}.${metricInfo.name} -> ${metricInfo.className}`)
    }
  }
  
  // Group metrics by category
  const metricsByCategory = groupMetricsByCategory(metrics)
  
  // Generate registry file
  generateRegistryFile(metricsByCategory, registryPath)
  
  console.log(`📝 Generated registry with ${metrics.length} metrics`)
  console.log(`📂 Categories: ${Object.keys(metricsByCategory).join(', ')}`)
}

/**
 * Parse a metric file to extract class information
 */
function parseMetricFile(content: string, filePath: string, fullPath: string): MetricInfo | null {
  // Extract class name (look for "export class ClassName")
  const classMatch = content.match(/export\s+class\s+(\w+)/)
  if (!classMatch) {
    return null
  }
  
  const className = classMatch[1]!
  
  // Derive category and name from file path
  // player/isMyTurn/isMyTurn.ts -> player.isMyTurn
  const pathParts = filePath.split('/')
  if (pathParts.length < 2) {
    console.warn(`⚠️  Invalid metric file path: ${filePath}`)
    return null
  }
  
  const category = pathParts[0]! // player, piece, square, etc.
  const name = pathParts[1]! // isMyTurn, isAttacked, etc.
  
  // Derive type from calculate method return type
  const type = deriveMetricType(content, className)
  
  // Calculate import path relative to registry file
  const registryDir = path.join(__dirname, '../src/core/metric')
  const relativePath = path.relative(registryDir, fullPath)
  const importPath = relativePath.replace(/\\/g, '/').replace(/\.ts$/, '')
  
  // Ensure the path starts with ../
  const finalImportPath = importPath.startsWith('../') ? importPath : `../${importPath}`
  
  return {
    name,
    className,
    category,
    filePath: filePath,
    importPath: finalImportPath,
    type
  }
}

/**
 * Derive metric type from calculate method return type
 */
function deriveMetricType(content: string, _className: string): string {
  // Look for calculate method with return type annotation
  const calculateMatch = content.match(/calculate\s*\([^)]*\)\s*:\s*(\w+)/)
  if (calculateMatch) {
    const returnType = calculateMatch[1]!
    // Map TypeScript types to JavaScript types
    switch (returnType) {
      case 'boolean': return 'boolean'
      case 'number': return 'number'
      case 'string': return 'string'
      case 'object': return 'object'
      case 'array': return 'array'
      default: return 'unknown'
    }
  }
  
  // Fallback: look for type property in class
  const typeMatch = content.match(/type\s*=\s*['"`]([^'"`]+)['"`]/)
  if (typeMatch) {
    return typeMatch[1]!
  }
  
  // Default fallback
  return 'unknown'
}

/**
 * Group metrics by their category
 */
function groupMetricsByCategory(metrics: MetricInfo[]): Record<string, MetricInfo[]> {
  const grouped: Record<string, MetricInfo[]> = {}
  
  for (const metric of metrics) {
    const category = metric.category
    if (!grouped[category]) {
      grouped[category] = []
    }
    grouped[category].push(metric)
  }
  
  return grouped
}

/**
 * Generate the registry TypeScript file
 */
function generateRegistryFile(metricsByCategory: Record<string, MetricInfo[]>, outputPath: string): void {
  const imports: string[] = []
  const registryEntries: string[] = []
  
  // Generate imports
  for (const [, metrics] of Object.entries(metricsByCategory)) {
    for (const metric of metrics) {
      imports.push(`import { ${metric.className} } from '${metric.importPath}'`)
    }
  }
  
  // Generate registry object
  registryEntries.push('export const METRIC_REGISTRY = {')
  
  for (const [categoryName, metrics] of Object.entries(metricsByCategory)) {
    const classNames = metrics.map(m => m.className).join(', ')
    registryEntries.push(`  ${categoryName}: [${classNames}],`)
  }
  
  registryEntries.push('} as const')
  
  // Generate metadata object with derived information
  registryEntries.push('')
  registryEntries.push('export const METRIC_METADATA = {')
  for (const [categoryName, metrics] of Object.entries(metricsByCategory)) {
    registryEntries.push(`  ${categoryName}: {`)
    for (const metric of metrics) {
      const fullName = `${metric.category}.${metric.name}`
      registryEntries.push(`    '${fullName}': {`)
      registryEntries.push(`      name: '${fullName}',`)
      registryEntries.push(`      type: '${metric.type}',`)
      registryEntries.push(`      category: '${metric.category}',`)
      registryEntries.push(`      className: '${metric.className}'`)
      registryEntries.push(`    },`)
    }
    registryEntries.push(`  },`)
  }
  registryEntries.push('} as const')
  
  // Generate type definitions
  const typeDefinitions = [
    '',
    'export type MetricCategory = keyof typeof METRIC_REGISTRY',
    '',
    'export type MetricClass = {',
    '  calculate: (...args: any[]) => any',
    '}',
    '',
    'export type MetricRegistry = {',
    '  [K in MetricCategory]: MetricClass[]',
    '}',
    '',
    'export type MetricMetadata = typeof METRIC_METADATA'
  ]
  
  // Combine all parts
  const fileContent = [
    '// This file is auto-generated by build-scripts/generate-metrics-registry.ts',
    '// Do not edit manually - it will be overwritten on next build',
    '',
    ...imports,
    '',
    ...registryEntries,
    ...typeDefinitions
  ].join('\n')
  
  // Write the file
  fs.writeFileSync(outputPath, fileContent, 'utf-8')
}

// Run the generator
if (require.main === module) {
  generateMetricsRegistry()
}
