import { NumberOfWhiteAttackersMetric } from './numberOfWhiteAttackers'
import { ChessBoard } from '../../../core/chess/board'
import { CHESS_POSITIONS } from '../../../../tests/fixtures/chess-positions'

describe('NumberOfWhiteAttackersMetric', () => {
  let metric: NumberOfWhiteAttackersMetric
  let board: ChessBoard

  beforeEach(() => {
    metric = new NumberOfWhiteAttackersMetric()
  })


  describe('Basic functionality', () => {
    it('should return 0 for starting position (placeholder)', () => {
      board = new ChessBoard(CHESS_POSITIONS.STARTING)
      const result = metric.calculate('e4', board)
      expect(result).toBe(0)
    })
  })
})
