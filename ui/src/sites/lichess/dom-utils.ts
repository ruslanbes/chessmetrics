/**
 * DOM utility functions for Lichess integration
 */

export class LichessDomUtils {
  /**
   * Find elements with FEN-related data attributes
   */
  findDataAttributes(): Array<{ tag: string; classes: string; dataFen: string | null; dataSquare: string | null; dataPos: string | null }> {
    const elements = document.querySelectorAll('[data-fen], [data-square], [data-pos]')
    return Array.from(elements).map(el => ({
      tag: el.tagName,
      classes: el.className,
      dataFen: el.getAttribute('data-fen'),
      dataSquare: el.getAttribute('data-square'),
      dataPos: el.getAttribute('data-pos')
    }))
  }

  /**
   * Find script tags containing FEN data
   */
  findScriptTagsWithFen(): Array<{ content: string }> {
    const scripts = document.querySelectorAll('script')
    const results: Array<{ content: string }> = []
    
    scripts.forEach(script => {
      const content = script.textContent || script.innerHTML
      if (content && content.toLowerCase().includes('fen')) {
        results.push({ content: content.substring(0, 200) + '...' }) // Truncate for readability
      }
    })
    
    return results
  }

  /**
   * Get board element counts for debugging
   */
  getBoardElementCounts(): { cgWrap: number; cgBoardWrap: number; pieces: number; moves: number } {
    return {
      cgWrap: document.querySelectorAll('.cg-wrap').length,
      cgBoardWrap: document.querySelectorAll('.cg-board-wrap').length,
      pieces: document.querySelectorAll('.piece, .cg-piece').length,
      moves: document.querySelectorAll('.move').length
    }
  }

  /**
   * Check if we're on a Lichess page
   */
  isLichessPage(): boolean {
    return window.location.hostname.includes('lichess.org')
  }
}
