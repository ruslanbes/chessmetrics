import { ChessBoard } from '../../../core/chess/ChessBoard'
import { Square } from '../../../types/chess'

export interface SquareMetricContext {
  square: Square
  board: ChessBoard
}

export class NumberOfWhiteAttackersMetric {
  description = "numberOfWhiteAttackers tells how many white pieces attack this square"
  min = 0
  max = 8 // Reasonable estimate for maximum white attackers in a real position

  calculate(square: Square, board: ChessBoard): number {
    // Get all white pieces and check if they can attack the target square
    const pieces = board.getPieces()
    const whitePieces = pieces.filter(piece => piece.color === 'white')
    
    let attackCount = 0
    for (const piece of whitePieces) {
      if (board.canAttack(piece.square, square, 'white')) {
        attackCount++
      }
    }
    
    return attackCount
  }
}
