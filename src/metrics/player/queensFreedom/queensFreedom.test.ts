import { QueensFreedomMetric } from './queensFreedom'
import { ChessBoard } from '../../../core/chess/ChessBoard'
import { CHESS_POSITIONS } from '../../../../tests/fixtures/chess-positions'

describe('QueensFreedomMetric', () => {
  let metric: QueensFreedomMetric
  let board: ChessBoard

  beforeEach(() => {
    metric = new QueensFreedomMetric()
  })

  describe('Basic functionality', () => {
    it('should return correct freedom for queens in starting position', () => {
      board = new ChessBoard(CHESS_POSITIONS.STARTING)
      
      // In starting position, both queens should have 0 freedom (blocked by pieces)
      const whiteQueensFreedom = metric.calculate(board, { player: 'white', board })
      const blackQueensFreedom = metric.calculate(board, { player: 'black', board })
      
      expect(whiteQueensFreedom).toBe(0)
      expect(blackQueensFreedom).toBe(0)
    })

    it('should return freedom for queens after development', () => {
      board = new ChessBoard(CHESS_POSITIONS.GIUOCO_PIANISSIMO)
      
      const whiteQueensFreedom = metric.calculate(board, { player: 'white', board })
      const blackQueensFreedom = metric.calculate(board, { player: 'black', board })
      
      expect(whiteQueensFreedom).toBe(2)
      expect(blackQueensFreedom).toBe(1)
    })

    it('should handle complex positions correctly', () => {
      board = new ChessBoard(CHESS_POSITIONS.QUEENS_GAMBIT)
      
      const whiteQueensFreedom = metric.calculate(board, { player: 'white', board })
      const blackQueensFreedom = metric.calculate(board, { player: 'black', board })
      
      expect(whiteQueensFreedom).toBe(5)
      expect(blackQueensFreedom).toBe(2)
    })

    it('should return freedom for both players regardless of turn', () => {
      board = new ChessBoard(CHESS_POSITIONS.AFTER_E4_E5)
      
      const whiteQueensFreedom = metric.calculate(board, { player: 'white', board })
      const blackQueensFreedom = metric.calculate(board, { player: 'black', board })
      
      expect(whiteQueensFreedom).toBe(4)
      expect(blackQueensFreedom).toBe(4)
    })

  })
})
