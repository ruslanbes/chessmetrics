import { ChessBoard } from '../../../core/chess/board'
import { Square } from '../../../types/chess'

export interface SquareMetricContext {
  square: Square
  board: ChessBoard
}

export class NumberOfBlackAttackersMetric {
  description = "numberOfBlackAttackers tells how many black pieces attack this square"
  min = 0
  max = 8 // Reasonable estimate for maximum black attackers in a real position

  calculate(square: Square, board: ChessBoard): number {
    // Get all black pieces and check if they can attack the target square
    const pieces = board.getPieces()
    const blackPieces = pieces.filter(piece => piece.color === 'black')
    
    let attackCount = 0
    for (const piece of blackPieces) {
      if (board.canAttack(piece.square, square, 'black')) {
        attackCount++
      }
    }
    
    return attackCount
  }
}
