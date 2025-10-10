import { ChessBoard } from '../../../core/chess/board'
import { Piece } from '../../../types/chess'

export interface PieceMetricContext {
  piece: Piece
  board: ChessBoard
}

export class FreedomMetric {
  description = "freedom tells how many legal moves this piece can make"
  dependencies: string[] = []

  calculate(piece: Piece, board: ChessBoard): number {
    // Get all legal moves for the current position
    const allMoves = board.getMoves()
    
    // Filter moves that start from this piece's square
    const pieceMoves = allMoves.filter(move => move.from === piece.square)
    
    return pieceMoves.length
  }
}
