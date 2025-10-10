import { ChessBoard } from '../../../core/chess/board'
import { Piece } from '../../../types/chess'

export interface PieceMetricContext {
  piece: Piece
  board: ChessBoard
}

export class NumberOfAttackersMetric {
  description = "numberOfAttackers tells how many enemy pieces are attacking this piece"
  dependencies: string[] = []

  calculate(_piece: Piece, _board: ChessBoard): number {
    // For now, return 0 - we'll implement this properly later
    return 0
  }
}
