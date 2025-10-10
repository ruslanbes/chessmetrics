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
    it('should count white pieces attacking empty squares in starting position', () => {
      board = new ChessBoard(CHESS_POSITIONS.STARTING)
      const result = metric.calculate('d3', board)
      expect(result).toBe(2) // White pawns on c2 and e2 can attack d3 diagonally
    })

    it('should count white pieces attacking squares occupied by white pieces', () => {
      board = new ChessBoard(CHESS_POSITIONS.STARTING)
      const result = metric.calculate('e2', board) // White pawn
      expect(result).toBe(4) // attacked by king, queen, bishop and knight
    })

    it('should return 0 for squares occupied by black pieces', () => {
      board = new ChessBoard(CHESS_POSITIONS.STARTING)
      const result = metric.calculate('e7', board) // Black pawn
      expect(result).toBe(0)
    })

    it('should return 1 for d5 after 1.e4 (white pawn on e4 can attack d5 diagonally)', () => {
      // After 1.e4, white pawn on e4 can attack d5 diagonally (imagining black pawn on d5)
      board = new ChessBoard(CHESS_POSITIONS.AFTER_E4)
      const result = metric.calculate('d5', board)
      expect(result).toBe(1) // White pawn on e4 can attack d5 diagonally
    })

    it('should return 1 for d5 after 1.e4 e5 (white pawn on e4 attacks d5 diagonally)', () => {
        // After 1.e4 e5, white pawn on e4 can attack d5 diagonally
        board = new ChessBoard(CHESS_POSITIONS.AFTER_E4_E5)
        const result = metric.calculate('d5', board)
        expect(result).toBe(1) // White pawn on e4 can attack d5 diagonally
      })

    it('should return 1 for d5 in Queen\'s Gambit (attacked by white pawn on c4)', () => {
      board = new ChessBoard(CHESS_POSITIONS.QUEENS_GAMBIT)
      const result = metric.calculate('d5', board)
      expect(result).toBe(1) // White pawn on c4 can capture to d5
    })

    it('should return 1 for g1 in starting position (attacked by white rook on h1)', () => {
      // Edge case: white rook can attack g1 even though it's occupied by white knight
      board = new ChessBoard(CHESS_POSITIONS.STARTING)
      const result = metric.calculate('g1', board)
      expect(result).toBe(1) // White rook on h1 can attack g1
    })
  })
})
