/**
 * FEN extraction strategy for Chessground elements
 */

import { FenExtractionStrategy, FenExtractionResult } from '../fen-extraction-strategy'

export class ChessgroundFenExtractor implements FenExtractionStrategy {
  canExtract(element: HTMLElement): boolean {
    // Check if element has chessground properties
    return !!(element as any).__chessground || 
           !!(element as any).chessground || 
           !!(element as any).cg ||
           element.classList.contains('cg-wrap') ||
           element.classList.contains('cg-board-wrap')
  }

  extractFen(element: HTMLElement): FenExtractionResult {
    try {
      // Method 1: Try to access chessground state from various possible locations
      const chessground = (element as any).__chessground || 
                          (element as any).chessground ||
                          (element as any).cg
      
      if (chessground?.state?.fen) {
        return { fen: chessground.state.fen, source: 'chessground' }
      }

      // Method 2: Try to access Lichess global objects
      const lichess = (window as any).lichess
      if (lichess?.analysis?.chessground?.state?.fen) {
        return { fen: lichess.analysis.chessground.state.fen, source: 'global' }
      }

      // Method 3: Try to find chessground instance in global scope
      const globalChessground = this.findGlobalChessground()
      if (globalChessground?.state?.fen) {
        return { fen: globalChessground.state.fen, source: 'global' }
      }

      return { source: 'chessground' }
    } catch (error) {
      console.warn('Failed to extract FEN from chessground:', error)
      return { source: 'chessground' }
    }
  }

  private findGlobalChessground(): any {
    try {
      const lichess = (window as any).lichess
      if (lichess?.analysis?.chessground) {
        return lichess.analysis.chessground
      }

      if (lichess?.chessground) {
        return lichess.chessground
      }

      // Try to find chessground in window object
      const windowObj = window as any
      for (const key in windowObj) {
        if (key.includes('chessground') && windowObj[key]?.state?.fen) {
          return windowObj[key]
        }
      }

      // Try to find chessground elements with data attributes
      const chessgroundElements = document.querySelectorAll('[data-chessground]')
      for (const el of Array.from(chessgroundElements)) {
        const cg = (el as any).__chessground || (el as any).chessground
        if (cg?.state?.fen) {
          return cg
        }
      }
    } catch (error) {
      console.warn('Failed to find global chessground:', error)
    }
    return null
  }
}
