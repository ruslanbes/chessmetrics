import { ChessBoard } from '../../../core/chess/board'
import { Piece } from '../../../types/chess'

export interface PieceMetricContext {
  piece: Piece
  board: ChessBoard
}

export class FreedomMetric {
  dependencies: string[] = []

  calculate(_piece: Piece, _board: ChessBoard): number {
    // For now, return 0 - we'll implement this properly later
    // This would require getting all possible moves for this piece
    return 0
  }
}
