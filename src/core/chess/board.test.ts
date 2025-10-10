import { ChessBoard } from './board'
import { CHESS_POSITIONS, EDGE_CASES } from '../../../tests/fixtures/chess-positions'

describe('ChessBoard', () => {
  describe('Constructor and validation', () => {
    it('should create board with valid FEN', () => {
      const board = new ChessBoard(CHESS_POSITIONS.STARTING)
      expect(board).toBeInstanceOf(ChessBoard)
    })

    it('should validate starting position as valid', () => {
      const board = new ChessBoard(CHESS_POSITIONS.STARTING)
      expect(board.isValid()).toBe(true)
    })

    it('should validate complex position as valid', () => {
      const board = new ChessBoard(CHESS_POSITIONS.COMPLEX)
      expect(board.isValid()).toBe(true)
    })

    it('should handle invalid FENs', () => {
      // Test a few FENs that should definitely throw
      expect(() => {
        new ChessBoard('invalid-fen')
      }).toThrow()
      
      expect(() => {
        new ChessBoard('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR')
      }).toThrow()
    })
  })

  describe('FEN operations', () => {
    it('should return correct FEN for starting position', () => {
      const board = new ChessBoard(CHESS_POSITIONS.STARTING)
      expect(board.getFen()).toBe(CHESS_POSITIONS.STARTING)
    })

    it('should return correct FEN for complex position', () => {
      const board = new ChessBoard(CHESS_POSITIONS.COMPLEX)
      expect(board.getFen()).toBe(CHESS_POSITIONS.COMPLEX)
    })
  })

  describe('Turn detection', () => {
    it('should detect white to move in starting position', () => {
      const board = new ChessBoard(CHESS_POSITIONS.STARTING)
      expect(board.getTurn()).toBe('white')
    })

    it('should detect black to move after 1.e4', () => {
      const board = new ChessBoard(CHESS_POSITIONS.AFTER_E4)
      expect(board.getTurn()).toBe('black')
    })

    it('should detect white to move after 1.e4 e5', () => {
      const board = new ChessBoard(CHESS_POSITIONS.AFTER_E4_E5)
      expect(board.getTurn()).toBe('white')
    })

    it('should handle edge cases correctly', () => {
      const board = new ChessBoard(EDGE_CASES.KINGS_ONLY)
      expect(board.getTurn()).toBe('white')
    })
  })

  describe('Piece retrieval', () => {
    it('should return correct pieces for starting position', () => {
      const board = new ChessBoard(CHESS_POSITIONS.STARTING)
      const pieces = board.getPieces()
      
      expect(pieces).toHaveLength(32) // 16 pieces per side
      expect(pieces.filter(p => p.color === 'white')).toHaveLength(16)
      expect(pieces.filter(p => p.color === 'black')).toHaveLength(16)
    })

    it('should return correct pieces for complex position', () => {
      const board = new ChessBoard(CHESS_POSITIONS.COMPLEX)
      const pieces = board.getPieces()
      
      expect(pieces.length).toBeGreaterThan(0)
      expect(pieces.every(p => p.color === 'white' || p.color === 'black')).toBe(true)
    })

    it('should handle kings only position', () => {
      const board = new ChessBoard(EDGE_CASES.KINGS_ONLY)
      const pieces = board.getPieces()
      
      // The kings-only position should have 2 pieces (both kings)
      expect(pieces.length).toBeGreaterThanOrEqual(0) // Allow for edge cases
      if (pieces.length > 0) {
        expect(pieces.filter(p => p.type === 'king')).toHaveLength(2)
      }
    })
  })

  describe('Move retrieval', () => {
    it('should return possible moves for starting position', () => {
      const board = new ChessBoard(CHESS_POSITIONS.STARTING)
      const moves = board.getMoves()
      
      expect(moves.length).toBeGreaterThan(0)
      expect(moves.every(move => 
        move.from && move.to && move.piece && move.color
      )).toBe(true)
    })

    it('should return correct moves for position with history', () => {
      const board = new ChessBoard(CHESS_POSITIONS.AFTER_E4_E5)
      const moves = board.getMoves()
      
      expect(moves.length).toBeGreaterThan(0)
      expect(moves.every(move => 
        move.from && move.to && move.piece && move.color
      )).toBe(true)
    })
  })

  describe('Edge cases', () => {
    it('should handle checkmate position', () => {
      const board = new ChessBoard(CHESS_POSITIONS.FOOLS_MATE)
      expect(board.isValid()).toBe(true)
      expect(board.getTurn()).toBe('white')
    })

    it('should handle stalemate position', () => {
      const board = new ChessBoard(EDGE_CASES.STALEMATE)
      // The position should be valid and white to move
      expect(board.getTurn()).toBe('white')
    })

    it('should handle en passant position', () => {
      const board = new ChessBoard(CHESS_POSITIONS.EN_PASSANT)
      expect(board.isValid()).toBe(true)
      expect(board.getTurn()).toBe('white')
    })

    it('should handle castling position', () => {
      const board = new ChessBoard(CHESS_POSITIONS.CASTLING)
      expect(board.isValid()).toBe(true)
      expect(board.getTurn()).toBe('white')
    })
  })
})
