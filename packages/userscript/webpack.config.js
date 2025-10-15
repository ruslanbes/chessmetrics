const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const fs = require('fs')

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, 'src/main.ts'),
  output: {
    filename: 'chessmetrics.user.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@ui': path.resolve(__dirname, 'ui'),
      '@engine': path.resolve(__dirname, 'ui/engine')
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: [/node_modules/, /\.test\.ts$/, /\.spec\.ts$/]
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true,
          format: {
            comments: function(node, comment) {
              // Preserve userscript metadata block
              return /==UserScript==/.test(comment.value) || /==\/UserScript==/.test(comment.value) || /@/.test(comment.value)
            }
          }
        },
        extractComments: false
      })
    ]
  },
  plugins: [
    // Plugin to move userscript metadata to the top and add build timestamp
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('MoveMetadataToTop', (compilation) => {
          const outputPath = path.resolve(__dirname, 'dist/chessmetrics.user.js')
          if (fs.existsSync(outputPath)) {
            const content = fs.readFileSync(outputPath, 'utf8')
            
            // Extract metadata block
            const metadataMatch = content.match(/\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/)
            if (metadataMatch) {
              let metadata = metadataMatch[0]
              const codeWithoutMetadata = content.replace(metadata, '').trim()
              
              // Generate build timestamp in format: YYYYMMDD-HHMMSS (UTC)
              const now = new Date()
              const year = now.getUTCFullYear()
              const month = String(now.getUTCMonth() + 1).padStart(2, '0')
              const day = String(now.getUTCDate()).padStart(2, '0')
              const hours = String(now.getUTCHours()).padStart(2, '0')
              const minutes = String(now.getUTCMinutes()).padStart(2, '0')
              const seconds = String(now.getUTCSeconds()).padStart(2, '0')
              const buildTimestamp = `${year}${month}${day}-${hours}${minutes}${seconds}`
              
              // Replace version with timestamped version
              metadata = metadata.replace(
                /@version\s+[\d.]+/,
                `@version      1.0.${buildTimestamp}`
              )
              
              // Apache 2.0 License header
              const licenseHeader = `/*
 * Copyright 2025 Chessmetrics Team
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * This userscript includes chess.js library, which is licensed under BSD-3-Clause License.
 */`
              
              // Reconstruct with license header and metadata at the top
              const newContent = licenseHeader + '\n\n' + metadata + '\n\n' + codeWithoutMetadata
              fs.writeFileSync(outputPath, newContent, 'utf8')
              
              console.log(`✅ Updated userscript version to 1.0.${buildTimestamp}`)
            }
          }
        })
      }
    }
  ],
  target: 'web'
}
