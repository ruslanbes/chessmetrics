/**
 * PGN building logic for Lichess pages
 */

import { LichessMove } from './types'

export class LichessPgnBuilder {
  /**
   * Extract moves from DOM elements
   */
  extractMoves(container: HTMLElement): LichessMove[] {
    const moves: LichessMove[] = []
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

  /**
   * Build PGN from moves array
   */
  buildPGN(moves: LichessMove[]): string {
    if (moves.length === 0) {
      return ''
    }

    const pgnMoves: string[] = []
    let moveNumber = 1

    for (let i = 0; i < moves.length; i += 2) {
      const whiteMove = moves[i]
      const blackMove = moves[i + 1]

      if (blackMove) {
        pgnMoves.push(`${moveNumber}.${whiteMove.san} ${blackMove.san}`)
      } else {
        pgnMoves.push(`${moveNumber}.${whiteMove.san}`)
      }
      moveNumber++
    }

    return pgnMoves.join(' ')
  }

  /**
   * Extract PGN from move list container
   */
  extractPGNFromMoves(): string | undefined {
    try {
      const moveContainer = document.querySelector('.analyse__moves') as HTMLElement
      if (!moveContainer) {
        return undefined
      }

      const moves = this.extractMoves(moveContainer)
      return this.buildPGN(moves)
    } catch (error) {
      console.warn('Failed to extract PGN from moves:', error)
      return undefined
    }
  }
}
