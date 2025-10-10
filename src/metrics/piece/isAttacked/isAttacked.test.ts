import { IsAttackedMetric } from './isAttacked'
import { ChessBoard } from '../../../core/chess/board'
import { CHESS_POSITIONS } from '../../../../tests/fixtures/chess-positions'

describe('IsAttackedMetric', () => {
  let metric: IsAttackedMetric
  let board: ChessBoard

  beforeEach(() => {
    metric = new IsAttackedMetric()
  })

  describe('Basic functionality', () => {
    it('should return false for starting position (placeholder)', () => {
      board = new ChessBoard(CHESS_POSITIONS.STARTING)
      const pieces = board.getPieces()
      const piece = pieces[0] // First piece
      
      expect(piece).toBeDefined()
      const result = metric.calculate(piece!, board)
      expect(result).toBe(false)
    })
  })

})
