import { ChessBoard } from '../../../core/chess/board'
import { Color } from '../../../types/chess'
import { FreedomMetric } from '../../piece/freedom/freedom'

export interface PlayerMetricContext {
  player: Color
  board: ChessBoard
}

export class KingsFreedomMetric {
  description = "kingsFreedom tells the freedom of this player's king piece"
  min = 0
  max = 8 // Maximum theoretical moves for a king (8 squares around it)
  dependencies: string[] = []

  private pieceFreedomMetric = new FreedomMetric()

  calculate(board: ChessBoard, context: PlayerMetricContext): number {
    const player = context.player
    
    // Get all pieces belonging to this player
    const pieces = board.getPieces()
    const playerKing = pieces.find(piece => piece.color === player && piece.type === 'king')
    
    if (!playerKing) {
      // If no king found, return 0 (shouldn't happen in valid chess positions)
      return 0
    }
    
    // Calculate the freedom of the king
    return this.pieceFreedomMetric.calculate(playerKing, board)
  }
}
