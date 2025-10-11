/**
 * FEN extraction strategy for page data and script tags
 */

import { FenExtractionStrategy, FenExtractionResult } from '../fen-extraction-strategy'

export class PageDataFenExtractor implements FenExtractionStrategy {
  canExtract(_element: HTMLElement): boolean {
    // Always try page data extraction as it's independent of DOM elements
    return true
  }

  extractFen(_element: HTMLElement): FenExtractionResult {
    try {
      // Method 1: Try to extract from page data (for game pages)
      const pageDataFen = this.extractFenFromPageData()
      if (pageDataFen) {
        return { fen: pageDataFen, source: 'script' }
      }

      // Method 2: Try to extract from script tags
      const scriptFen = this.extractFenFromScriptTags()
      if (scriptFen) {
        return { fen: scriptFen, source: 'script' }
      }

      return { source: 'script' }
    } catch (error) {
      console.warn('Failed to extract FEN from page data:', error)
      return { source: 'script' }
    }
  }

  private extractFenFromPageData(): string | undefined {
    try {
      // Check for FEN in body or html data attributes
      const bodyFen = document.body.getAttribute('data-fen')
      if (bodyFen) {
        return bodyFen
      }

      const htmlFen = document.documentElement.getAttribute('data-fen')
      if (htmlFen) {
        return htmlFen
      }

      return undefined
    } catch (error) {
      console.warn('Failed to extract FEN from page data:', error)
      return undefined
    }
  }

  private extractFenFromScriptTags(): string | undefined {
    try {
      const scripts = document.querySelectorAll('script')
      for (const script of Array.from(scripts)) {
        const content = script.textContent || script.innerHTML
        if (content && content.includes('fen')) {
          // Look for FEN patterns in script content
          const fenMatch = content.match(/fen["\s]*[:=]["\s]*([^"'\s]+)/i)
          if (fenMatch && fenMatch[1]) {
            return fenMatch[1]
          }
        }
      }
      return undefined
    } catch (error) {
      console.warn('Failed to extract FEN from script tags:', error)
      return undefined
    }
  }
}
