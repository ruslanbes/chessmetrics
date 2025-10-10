import { ChessBoard } from '../../../core/chess/board'
import { Color } from '../../../types/chess'

export interface MetricContext {
  player: Color
  board: ChessBoard
}

export class IsMyTurnMetric {
  description = "isMyTurn tells if it's currently this player's turn"

  calculate(board: ChessBoard, context: MetricContext): boolean {
    const currentTurn = board.getTurn()
    return currentTurn === context.player
  }
}
