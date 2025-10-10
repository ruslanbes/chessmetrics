import { IsMyTurnMetric } from './isMyTurn'
import { ChessBoard } from '../../../core/chess/board'
import { CHESS_POSITIONS, EDGE_CASES } from '../../../../tests/fixtures/chess-positions'

describe('IsMyTurnMetric', () => {
  let metric: IsMyTurnMetric
  let board: ChessBoard

  beforeEach(() => {
    metric = new IsMyTurnMetric()
  })

  describe('Basic functionality', () => {
    it('should return true when it is white to move', () => {
      board = new ChessBoard(CHESS_POSITIONS.STARTING)
      const result = metric.calculate(board, { player: 'white', board })
      expect(result).toBe(true)
    })

    it('should return false when it is black to move', () => {
      board = new ChessBoard(CHESS_POSITIONS.AFTER_E4)
      const result = metric.calculate(board, { player: 'white', board })
      expect(result).toBe(false)
    })

    it('should return true when it is black to move', () => {
      board = new ChessBoard(CHESS_POSITIONS.AFTER_E4)
      const result = metric.calculate(board, { player: 'black', board })
      expect(result).toBe(true)
    })

    it('should return false when it is white to move', () => {
      board = new ChessBoard(CHESS_POSITIONS.AFTER_E4_E5)
      const result = metric.calculate(board, { player: 'black', board })
      expect(result).toBe(false)
    })
  })

  describe('Edge cases', () => {
    it('should handle checkmate position correctly', () => {
      board = new ChessBoard(CHESS_POSITIONS.FOOLS_MATE)
      const result = metric.calculate(board, { player: 'white', board })
      expect(result).toBe(true) // White to move in checkmate
    })

    it('should handle stalemate position correctly', () => {
      board = new ChessBoard(EDGE_CASES.STALEMATE)
      const result = metric.calculate(board, { player: 'white', board })
      expect(result).toBe(true) // White to move in stalemate
    })

    it('should handle kings only position correctly', () => {
      board = new ChessBoard(EDGE_CASES.KINGS_ONLY)
      const result = metric.calculate(board, { player: 'white', board })
      expect(result).toBe(true) // White to move with kings only
    })
  })

  describe('Integration with different positions', () => {
    const testCases = [
      { fen: CHESS_POSITIONS.STARTING, expectedWhite: true, expectedBlack: false },
      { fen: CHESS_POSITIONS.AFTER_E4, expectedWhite: false, expectedBlack: true },
      { fen: CHESS_POSITIONS.AFTER_E4_E5, expectedWhite: true, expectedBlack: false },
      { fen: CHESS_POSITIONS.AFTER_E4_E5_NF3, expectedWhite: false, expectedBlack: true },
      { fen: CHESS_POSITIONS.EN_PASSANT, expectedWhite: true, expectedBlack: false },
      { fen: CHESS_POSITIONS.CASTLING, expectedWhite: true, expectedBlack: false },
      { fen: CHESS_POSITIONS.COMPLEX, expectedWhite: true, expectedBlack: false }
    ]

    testCases.forEach(({ fen, expectedWhite, expectedBlack }, index) => {
      it(`should handle position ${index + 1} correctly`, () => {
        board = new ChessBoard(fen)
        
        const whiteResult = metric.calculate(board, { player: 'white', board })
        const blackResult = metric.calculate(board, { player: 'black', board })
        
        expect(whiteResult).toBe(expectedWhite)
        expect(blackResult).toBe(expectedBlack)
      })
    })
  })
})
