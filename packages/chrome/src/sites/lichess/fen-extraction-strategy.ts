/**
 * Strategy interface for FEN extraction
 */

import { FenExtractionResult } from './types'

export interface FenExtractionStrategy {
  /**
   * Check if this strategy can extract FEN from the given element
   */
  canExtract(element: HTMLElement): boolean

  /**
   * Extract FEN using this strategy
   */
  extractFen(element: HTMLElement): FenExtractionResult
}

// Re-export the type for convenience
export type { FenExtractionResult } from './types'
