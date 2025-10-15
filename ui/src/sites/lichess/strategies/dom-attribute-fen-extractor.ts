/**
 * FEN extraction strategy for DOM data attributes
 */

import { FenExtractionStrategy, FenExtractionResult } from '../fen-extraction-strategy'

export class DomAttributeFenExtractor implements FenExtractionStrategy {
  canExtract(element: HTMLElement): boolean {
    // This strategy can always try to extract FEN from the document
    // regardless of the specific element, since it searches globally
    const hasElementFen = this.hasFenAttribute(element)
    const hasParentFen = this.hasFenInParents(element)
    const hasGlobalFen = this.hasFenInDocument()
    const canExtract = hasElementFen || hasParentFen || hasGlobalFen
    
    return canExtract
  }

  extractFen(element: HTMLElement): FenExtractionResult {
    try {
      // Method 1: Check for pv_box element with data-fen (common on Lichess)
      const pvBox = document.querySelector('.pv_box[data-fen]')
      if (pvBox) {
        const pvFen = pvBox.getAttribute('data-fen')
        if (pvFen) {
          return { fen: pvFen, source: 'dom' }
        }
      }

      // Method 2: Check for any element with data-fen attribute
      const anyFenElement = document.querySelector('[data-fen]')
      if (anyFenElement) {
        const anyFen = anyFenElement.getAttribute('data-fen')
        if (anyFen) {
          return { fen: anyFen, source: 'dom' }
        }
      }

      // Method 3: Check data attributes on element and parents
      const fenAttr = element.getAttribute('data-fen')
      if (fenAttr) {
        return { fen: fenAttr, source: 'dom' }
      }

      // Method 4: Look for FEN in parent elements
      let parent = element.parentElement
      while (parent && parent !== document.body) {
        const parentFen = parent.getAttribute('data-fen')
        if (parentFen) {
          return { fen: parentFen, source: 'dom' }
        }
        parent = parent.parentElement
      }

      return { source: 'dom' }
    } catch (error) {
      console.warn('Failed to extract FEN from DOM attributes:', error)
      return { source: 'dom' }
    }
  }

  private hasFenAttribute(element: HTMLElement): boolean {
    return !!(element.getAttribute('data-fen') || 
              element.getAttribute('data-square') || 
              element.getAttribute('data-pos'))
  }

  private hasFenInParents(element: HTMLElement): boolean {
    let parent = element.parentElement
    while (parent && parent !== document.body) {
      if (this.hasFenAttribute(parent)) {
        return true
      }
      parent = parent.parentElement
    }
    return false
  }

  private hasFenInDocument(): boolean {
    // Check if there are any elements with FEN attributes in the document
    const fenElements = document.querySelectorAll('[data-fen]')
    return fenElements.length > 0
  }
}
