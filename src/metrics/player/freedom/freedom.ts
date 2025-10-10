import { ChessBoard } from '../../../core/chess/board'
import { Color } from '../../../types/chess'

export interface PlayerMetricContext {
  player: Color
  board: ChessBoard
}

export class PlayerFreedomMetric {
  description = "freedom tells the sum of freedoms of all pieces for this player"
  min = 0
  max = 100 // Reasonable estimate for maximum freedom in a real position
  dependencies: string[] = []

  calculate(board: ChessBoard, context: PlayerMetricContext): number {
    const player = context.player
    
    // Get all pieces belonging to this player
    const pieces = board.getPieces()
    const playerPieces = pieces.filter(piece => piece.color === player)
    
    // Get all possible moves for both colors
    const allMoves = board.getAllMoves()
    
    // Calculate freedom for each piece by counting moves that start from that piece
    let totalFreedom = 0
    for (const piece of playerPieces) {
      const pieceMoves = allMoves.filter(move => 
        move.from === piece.square && move.color === player
      )
      totalFreedom += pieceMoves.length
    }
    
    return totalFreedom
  }
}
