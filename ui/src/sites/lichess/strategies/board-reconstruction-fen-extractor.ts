/**
 * FEN extraction strategy for reconstructing FEN from board pieces
 */

import { FenExtractionStrategy, FenExtractionResult } from '../fen-extraction-strategy'

export class BoardReconstructionFenExtractor implements FenExtractionStrategy {
  canExtract(element: HTMLElement): boolean {
    // Check if element contains chess pieces
    const pieces = element.querySelectorAll('.piece, .cg-piece')
    return pieces.length > 0
  }

  extractFen(element: HTMLElement): FenExtractionResult {
    try {
      // Try to reconstruct FEN from board pieces
      const reconstructedFen = this.reconstructFenFromBoard(element)
      if (reconstructedFen) {
        return { fen: reconstructedFen, source: 'reconstruction' }
      }

      return { source: 'reconstruction' }
    } catch (error) {
      console.warn('Failed to reconstruct FEN from board:', error)
      return { source: 'reconstruction' }
    }
  }

  private reconstructFenFromBoard(element: HTMLElement): string | undefined {
    try {
      // Create 8x8 board representation
      const board: (string | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null))
      
      // Find all pieces on the board
      const pieces = element.querySelectorAll('.piece, .cg-piece')
      
      pieces.forEach(piece => {
        const pieceClass = piece.className
        const pieceType = this.extractPositionFromClass(pieceClass)
        
        if (pieceType) {
          const pos = piece.getAttribute('data-pos') ||
                     piece.getAttribute('data-square') ||
                     this.extractPositionFromClass(pieceClass)
          
          if (pos && pos.length >= 2) {
            const file = pos.charCodeAt(0) - 97 // a=0, b=1, etc.
            const rank = 8 - parseInt(pos[1]) // 8=0, 7=1, etc.
            
            if (file >= 0 && file < 8 && rank >= 0 && rank < 8) {
              board[rank][file] = pieceType
            }
          }
        }
      })
      
      // Convert board to FEN
      return this.boardToFen(board)
    } catch (error) {
      console.warn('Failed to reconstruct FEN from board:', error)
      return undefined
    }
  }

  private extractPositionFromClass(className: string): string | undefined {
    // Extract piece type and position from CSS class
    // This is a simplified implementation - real implementation would be more complex
    const pieceMatch = className.match(/([wb][kqrbnp])-([a-h][1-8])/)
    if (pieceMatch) {
      return pieceMatch[1] // Return piece type (e.g., 'wp', 'bk')
    }
    return undefined
  }

  private boardToFen(board: (string | null)[][]): string {
    const fenParts: string[] = []
    
    for (let rank = 0; rank < 8; rank++) {
      let fenRank = ''
      let emptyCount = 0
      
      for (let file = 0; file < 8; file++) {
        const piece = board[rank][file]
        if (piece) {
          if (emptyCount > 0) {
            fenRank += emptyCount.toString()
            emptyCount = 0
          }
          fenRank += piece
        } else {
          emptyCount++
        }
      }
      
      if (emptyCount > 0) {
        fenRank += emptyCount.toString()
      }
      
      fenParts.push(fenRank)
    }
    
    // Add basic FEN parts (simplified - real implementation would need more context)
    return fenParts.join('/') + ' w - - 0 1'
  }
}
