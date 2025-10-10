import { NumberOfAttackersMetric } from './numberOfAttackers'
import { ChessBoard } from '../../../core/chess/board'
import { CHESS_POSITIONS } from '../../../../tests/fixtures/chess-positions'

describe('NumberOfAttackersMetric', () => {
  let metric: NumberOfAttackersMetric
  let board: ChessBoard

  beforeEach(() => {
    metric = new NumberOfAttackersMetric()
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

  describe('Metric properties', () => {
    it('should have no dependencies', () => {
      expect(metric.dependencies).toEqual([])
    })
  })
})
