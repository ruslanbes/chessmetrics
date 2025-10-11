import { NumberOfBlackAttackersMetric } from './numberOfBlackAttackers'
import { ChessBoard } from '../../../core/chess/ChessBoard'
import { CHESS_POSITIONS } from '../../../../tests/fixtures/chess-positions'

describe('NumberOfBlackAttackersMetric', () => {
  let metric: NumberOfBlackAttackersMetric
  let board: ChessBoard

  beforeEach(() => {
    metric = new NumberOfBlackAttackersMetric()
  })


  describe('Basic functionality', () => {
    it('should return 0 for empty squares in starting position', () => {
      board = new ChessBoard(CHESS_POSITIONS.STARTING)
      const result = metric.calculate('e4', board)
      expect(result).toBe(0)
    })

    it('should count black pieces attacking squares occupied by black pieces', () => {
      board = new ChessBoard(CHESS_POSITIONS.STARTING)
      const result = metric.calculate('e7', board) // Black pawn
      expect(result).toBe(4) // Attacked by black queen, king, bishop and knight
    })

    it('should return 0 for squares occupied by white pieces', () => {
      board = new ChessBoard(CHESS_POSITIONS.STARTING)
      const result = metric.calculate('e2', board) // White pawn
      expect(result).toBe(0)
    })

    it('should return 0 for d5 after 1.e4 e5 (no black pieces can attack empty d5)', () => {
      // After 1.e4 e5, no black pieces can attack d5 (pawn can only attack diagonally when capturing)
      board = new ChessBoard(CHESS_POSITIONS.AFTER_E4_E5)
      const result = metric.calculate('d5', board)
      expect(result).toBe(0) // No black pieces can attack empty d5
    })

    it('should return 1 for c4 in Queen\'s Gambit (attacked by black pawn on d5)', () => {
      board = new ChessBoard(CHESS_POSITIONS.QUEENS_GAMBIT)
      const result = metric.calculate('c4', board)
      expect(result).toBe(1) // Black pawn on d5 can capture to c4
    })
  })
})
