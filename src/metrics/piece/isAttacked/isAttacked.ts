import { ChessBoard } from '../../../core/chess/board'
import { Piece } from '../../../types/chess'

export interface PieceMetricContext {
  piece: Piece
  board: ChessBoard
}

export class IsAttackedMetric {
  description = "isAttacked tells if this piece is under attack by enemy pieces"
  dependencies: string[] = []

  calculate(_piece: Piece, _board: ChessBoard): boolean {
    // For now, return false - we'll implement this properly later
    // This would require checking if any opponent pieces can attack this square
    return false
  }
}
