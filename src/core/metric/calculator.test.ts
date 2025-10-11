import { MetricCalculator } from './calculator'
import { ChessBoard } from '../chess/ChessBoard'
import { CHESS_POSITIONS, ENDINGS } from '../../../tests/fixtures/chess-positions'

describe('MetricCalculator', () => {
  let calculator: MetricCalculator
  let board: ChessBoard

  beforeEach(() => {
    calculator = new MetricCalculator()
  })

  describe('Basic functionality', () => {
    it('should calculate metrics for starting position', () => {
      board = new ChessBoard(CHESS_POSITIONS.STARTING)
      const result = calculator.calculate(board)
      
      expect(result).toHaveProperty('players')
      expect(result).toHaveProperty('pieces')
      expect(result).toHaveProperty('squares')
      expect(result.players).toHaveProperty('white')
      expect(result.players).toHaveProperty('black')
      expect(result.players.white).toHaveProperty('isMyTurn')
      expect(result.players.black).toHaveProperty('isMyTurn')
      expect(result.squares).toHaveLength(64)
    })

    it('should return correct squares structure', () => {
      board = new ChessBoard(CHESS_POSITIONS.STARTING)
      const result = calculator.calculate(board)
      
      // Check that we have all 64 squares
      expect(result.squares).toHaveLength(64)
      
      // Check that each square has the expected structure
      const firstSquare = result.squares[0]
      expect(firstSquare).toHaveProperty('square')
      expect(firstSquare).toHaveProperty('numberOfWhiteAttackers')
      expect(firstSquare).toHaveProperty('numberOfBlackAttackers')
      
      // Check that square names are valid
      const squareNames = result.squares.map(s => s.square)
      expect(squareNames).toContain('a1')
      expect(squareNames).toContain('h8')
      expect(squareNames).toContain('e4')
    })

    it('should return correct turn values for starting position', () => {
      board = new ChessBoard(CHESS_POSITIONS.STARTING)
      const result = calculator.calculate(board)
      
      expect(result.players.white.isMyTurn).toBe(true)
      expect(result.players.black.isMyTurn).toBe(false)
    })

    it('should return correct turn values after 1.e4', () => {
      board = new ChessBoard(CHESS_POSITIONS.AFTER_E4)
      const result = calculator.calculate(board)
      
      expect(result.players.white.isMyTurn).toBe(false)
      expect(result.players.black.isMyTurn).toBe(true)
    })

    it('should return correct turn values after 1.e4 e5', () => {
      board = new ChessBoard(CHESS_POSITIONS.AFTER_E4_E5)
      const result = calculator.calculate(board)
      
      expect(result.players.white.isMyTurn).toBe(true)
      expect(result.players.black.isMyTurn).toBe(false)
    })
  })

  describe('Edge cases', () => {
    it('should handle checkmate position', () => {
      board = new ChessBoard(CHESS_POSITIONS.FOOLS_MATE)
      const result = calculator.calculate(board)
      
      expect(result.players.white.isMyTurn).toBe(true)
      expect(result.players.black.isMyTurn).toBe(false)
    })

    it('should handle stalemate position', () => {
      board = new ChessBoard(ENDINGS.KINGS_ONLY)
      const result = calculator.calculate(board)
      
      expect(result.players.white.isMyTurn).toBe(true)
      expect(result.players.black.isMyTurn).toBe(false)
    })

    it('should handle kings only position', () => {
      board = new ChessBoard(ENDINGS.KINGS_ONLY)
      const result = calculator.calculate(board)
      
      expect(result.players.white.isMyTurn).toBe(true)
      expect(result.players.black.isMyTurn).toBe(false)
    })
  })

  describe('Multiple positions', () => {
    const testCases = [
      { fen: CHESS_POSITIONS.STARTING, expectedWhite: true, expectedBlack: false },
      { fen: CHESS_POSITIONS.AFTER_E4, expectedWhite: false, expectedBlack: true },
      { fen: CHESS_POSITIONS.AFTER_E4_E5, expectedWhite: true, expectedBlack: false },
      { fen: CHESS_POSITIONS.AFTER_E4_E5_NF3, expectedWhite: false, expectedBlack: true },
      { fen: CHESS_POSITIONS.EN_PASSANT, expectedWhite: true, expectedBlack: false },
      { fen: CHESS_POSITIONS.CASTLING, expectedWhite: true, expectedBlack: false },
      { fen: CHESS_POSITIONS.GIUOCO_PIANISSIMO, expectedWhite: true, expectedBlack: false }
    ]

    testCases.forEach(({ fen, expectedWhite, expectedBlack }, index) => {
      it(`should handle position ${index + 1} correctly`, () => {
        board = new ChessBoard(fen)
        const result = calculator.calculate(board)
        
        expect(result.players.white.isMyTurn).toBe(expectedWhite)
        expect(result.players.black.isMyTurn).toBe(expectedBlack)
      })
    })
  })

  describe('Return type validation', () => {
    it('should return object with correct structure', () => {
      board = new ChessBoard(CHESS_POSITIONS.STARTING)
      const result = calculator.calculate(board)
      
      expect(typeof result).toBe('object')
      expect(result).toHaveProperty('players')
      expect(result).toHaveProperty('pieces')
      expect(typeof result.players.white).toBe('object')
      expect(typeof result.players.black).toBe('object')
    })

    it('should return boolean values for isMyTurn', () => {
      board = new ChessBoard(CHESS_POSITIONS.STARTING)
      const result = calculator.calculate(board)
      
      expect(typeof result.players.white.isMyTurn).toBe('boolean')
      expect(typeof result.players.black.isMyTurn).toBe('boolean')
    })
  })
})
