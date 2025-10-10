import { ChessBoard } from '../../../core/chess/board'
import { Color } from '../../../types/chess'
import { FreedomMetric } from '../../piece/freedom/freedom'

export interface PlayerMetricContext {
  player: Color
  board: ChessBoard
}

export class QueensFreedomMetric {
  description = "queensFreedom tells the sum of freedoms of all queen pieces for this player"
  min = 0
  max = 27 // Maximum freedom for a queen on an empty board

  private pieceFreedomMetric = new FreedomMetric()

  calculate(board: ChessBoard, context: PlayerMetricContext): number {
    const player = context.player
    
    // Get all pieces belonging to this player
    const pieces = board.getPieces()
    const playerQueens = pieces.filter(piece => piece.color === player && piece.type === 'queen')
    
    // Sum up the freedom of all queen pieces
    let totalFreedom = 0
    for (const queen of playerQueens) {
      totalFreedom += this.pieceFreedomMetric.calculate(queen, board)
    }
    
    return totalFreedom
  }
}
