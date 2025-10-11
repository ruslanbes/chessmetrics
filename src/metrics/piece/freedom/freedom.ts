import { ChessBoard } from '../../../core/chess/ChessBoard'
import { Piece } from '../../../types/chess'

export interface PieceMetricContext {
  piece: Piece
  board: ChessBoard
}

export class FreedomMetric {
  description = "freedom tells how many legal moves this piece can make"
  min = 0
  max = 27 // Maximum theoretical moves for a queen on an empty board

  calculate(piece: Piece, board: ChessBoard): number {
    // Get all possible moves for both colors
    const allMoves = board.getAllMoves()
    
    // Filter moves that start from this piece's square and are for this piece's color
    const pieceMoves = allMoves.filter(move => 
      move.from === piece.square && move.color === piece.color
    )
    
    return pieceMoves.length
  }
}
