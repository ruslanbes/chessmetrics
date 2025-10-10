import { ChessBoard } from '../../../core/chess/board'
import { Piece } from '../../../types/chess'

export interface PieceMetricContext {
  piece: Piece
  board: ChessBoard
}

export class IsHangingMetric {
  description = "isHanging tells if this piece is hanging (attacked but not defended)"
  dependencies: string[] = ['piece.isAttacked', 'piece.isDefended']

  calculate(_piece: Piece, _board: ChessBoard): boolean {
    // For now, return false - we'll implement this properly later
    // This would require checking if piece is attacked but not defended
    return false
  }
}
