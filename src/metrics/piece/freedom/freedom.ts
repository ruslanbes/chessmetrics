import { ChessBoard } from '../../../core/chess/board'
import { Piece } from '../../../types/chess'

export interface PieceMetricContext {
  piece: Piece
  board: ChessBoard
}

export class FreedomMetric {
  description = "freedom tells how many legal moves this piece can make"
  min = 0
  max = 27 // Maximum theoretical moves for a queen on an empty board
  dependencies: string[] = []

  calculate(piece: Piece, board: ChessBoard): number {
    // Get all legal moves for the current position
    const allMoves = board.getMoves()
    
    // Filter moves that start from this piece's square
    const pieceMoves = allMoves.filter(move => move.from === piece.square)
    
    return pieceMoves.length
  }
}
