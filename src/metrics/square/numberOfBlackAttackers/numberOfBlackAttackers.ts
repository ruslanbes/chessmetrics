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
  dependencies: string[] = []

  calculate(_square: Square, _board: ChessBoard): number {
    // For now, return 0 - we'll implement this properly later
    // This would require checking which black pieces can attack this square
    return 0
  }
}
