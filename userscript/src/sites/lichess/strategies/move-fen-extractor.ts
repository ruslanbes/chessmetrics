/**
 * FEN extraction strategy for current position from move list
 */

import { FenExtractionStrategy, FenExtractionResult } from '../fen-extraction-strategy'

export class MoveFenExtractor implements FenExtractionStrategy {
  canExtract(_element: HTMLElement): boolean {
    // Always try move extraction as it's independent of DOM elements
    return true
  }

  extractFen(_element: HTMLElement): FenExtractionResult {
    try {
      // Try to extract from move list (current position)
      const currentFen = this.extractCurrentFenFromMoves()
      if (currentFen) {
        return { fen: currentFen, source: 'dom' }
      }

      return { source: 'dom' }
    } catch (error) {
      console.warn('Failed to extract FEN from moves:', error)
      return { source: 'dom' }
    }
  }

  private extractCurrentFenFromMoves(): string | undefined {
    try {
      // Look for active move to determine current position
      const activeMove = document.querySelector('.move.active')
      if (activeMove) {
        const fenAttr = activeMove.getAttribute('data-fen')
        if (fenAttr) {
          return fenAttr
        }
      }

      // Try to find FEN in move elements
      const moveElements = document.querySelectorAll('.move[data-fen]')
      if (moveElements.length > 0) {
        const lastMove = moveElements[moveElements.length - 1]
        const fenAttr = lastMove.getAttribute('data-fen')
        if (fenAttr) {
          return fenAttr
        }
      }

      // Try to extract from moves container
      const movesContainer = document.querySelector('.moves, .analyse__moves')
      if (movesContainer) {
        const moves = this.extractMoves(movesContainer as HTMLElement)
        if (moves.length > 0) {
          // Find the last move and try to get its FEN
          const lastMove = moves[moves.length - 1]
          // This would require more complex logic to reconstruct FEN from moves
          // For now, return undefined as this is a complex operation
        }
      }

      return undefined
    } catch (error) {
      console.warn('Failed to extract current FEN from moves:', error)
      return undefined
    }
  }

  private extractMoves(container: HTMLElement): Array<{ san: string; path: string; ply: number; isActive: boolean }> {
    const moves: Array<{ san: string; path: string; ply: number; isActive: boolean }> = []
    const moveElements = container.querySelectorAll('.move')
    
    moveElements.forEach((moveEl, index) => {
      const san = moveEl.textContent?.trim() || ''
      const path = moveEl.getAttribute('data-path') || ''
      const ply = index + 1
      const isActive = moveEl.classList.contains('active')
      
      if (san) {
        moves.push({ san, path, ply, isActive })
      }
    })
    
    return moves
  }
}
