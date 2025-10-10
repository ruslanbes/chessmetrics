import { ChessBoard } from '../../../core/chess/board'
import { Square } from '../../../types/chess'

export interface SquareMetricContext {
  square: Square
  board: ChessBoard
}

export class NumberOfWhiteAttackersMetric {
  description = "numberOfWhiteAttackers tells how many white pieces attack this square"
  min = 0
  max = 8 // Reasonable estimate for maximum white attackers in a real position
  dependencies: string[] = []

  calculate(_square: Square, _board: ChessBoard): number {
    // For now, return 0 - we'll implement this properly later
    // This would require checking which white pieces can attack this square
    return 0
  }
}
