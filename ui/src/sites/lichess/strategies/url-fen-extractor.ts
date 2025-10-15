/**
 * FEN extraction strategy for URL parameters and hash
 */

import { FenExtractionStrategy, FenExtractionResult } from '../fen-extraction-strategy'

export class UrlFenExtractor implements FenExtractionStrategy {
  canExtract(_element: HTMLElement): boolean {
    // Always try URL extraction as it's independent of DOM elements
    return true
  }

  extractFen(_element: HTMLElement): FenExtractionResult {
    try {
      // Method 1: Try to extract from URL parameters
      const urlParams = new URLSearchParams(window.location.search)
      const fenParam = urlParams.get('fen')
      if (fenParam) {
        return { fen: fenParam, source: 'url' }
      }

      // Method 2: Try to extract from hash
      const hash = window.location.hash
      const fenMatch = hash.match(/fen=([^&]+)/)
      if (fenMatch) {
        return { fen: decodeURIComponent(fenMatch[1]), source: 'url' }
      }

      return { source: 'url' }
    } catch (error) {
      console.warn('Failed to extract FEN from URL:', error)
      return { source: 'url' }
    }
  }
}
