import { FreedomMetric } from './freedom'
import { ChessBoard } from '../../../core/chess/board'
import { CHESS_POSITIONS } from '../../../../tests/fixtures/chess-positions'

describe('FreedomMetric', () => {
  let metric: FreedomMetric
  let board: ChessBoard

  beforeEach(() => {
    metric = new FreedomMetric()
  })

  describe('Basic functionality', () => {
    it('should return 0 for starting position (placeholder)', () => {
      board = new ChessBoard(CHESS_POSITIONS.STARTING)
      const pieces = board.getPieces()
      const piece = pieces[0] // First piece
      
      expect(piece).toBeDefined()
      const result = metric.calculate(piece!, board)
      expect(result).toBe(0)
    })
  })

})
