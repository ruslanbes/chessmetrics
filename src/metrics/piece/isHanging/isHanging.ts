import { ChessBoard } from '../../../core/chess/board'
import { Piece } from '../../../types/chess'
import { NumberOfBlackAttackersMetric } from '../../square/numberOfBlackAttackers/numberOfBlackAttackers'
import { NumberOfWhiteAttackersMetric } from '../../square/numberOfWhiteAttackers/numberOfWhiteAttackers'

export interface PieceMetricContext {
  piece: Piece
  board: ChessBoard
}

export class IsHangingMetric {
  description = "isHanging tells if this piece is hanging (attacked but not defended)"

  private blackAttackersMetric = new NumberOfBlackAttackersMetric()
  private whiteAttackersMetric = new NumberOfWhiteAttackersMetric()

  calculate(piece: Piece, board: ChessBoard): boolean {
    const square = piece.square
    
    // Count attackers of both colors
    const blackAttackers = this.blackAttackersMetric.calculate(square, board)
    const whiteAttackers = this.whiteAttackersMetric.calculate(square, board)
    
    // A piece is hanging if:
    // 1. It has at least one attacker of the opposite color
    // 2. It has no attackers of the same color (not defended)
    if (piece.color === 'white') {
      // For white pieces: has black attackers but no white defenders
      return blackAttackers > 0 && whiteAttackers === 0
    } else {
      // For black pieces: has white attackers but no black defenders
      return whiteAttackers > 0 && blackAttackers === 0
    }
  }
}
