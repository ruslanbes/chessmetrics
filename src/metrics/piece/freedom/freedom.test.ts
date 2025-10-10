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
    it('should return correct freedom for starting position pieces', () => {
      board = new ChessBoard(CHESS_POSITIONS.STARTING)
      const pieces = board.getPieces()
      
      // Test a pawn (should have 2 moves: e2-e3, e2-e4)
      const e2Pawn = pieces.find(p => p.square === 'e2')
      expect(e2Pawn).toBeDefined()
      const pawnFreedom = metric.calculate(e2Pawn!, board)
      expect(pawnFreedom).toBe(2)
      
      // Test a knight (should have 2 moves: b1-a3, b1-c3)
      const b1Knight = pieces.find(p => p.square === 'b1')
      expect(b1Knight).toBeDefined()
      const knightFreedom = metric.calculate(b1Knight!, board)
      expect(knightFreedom).toBe(2)
      
      // Test a rook (should have 0 moves - blocked by pawns)
      const a1Rook = pieces.find(p => p.square === 'a1')
      expect(a1Rook).toBeDefined()
      const rookFreedom = metric.calculate(a1Rook!, board)
      expect(rookFreedom).toBe(0)
    })

    it('should return 0 for pieces with no legal moves', () => {
      board = new ChessBoard(CHESS_POSITIONS.STARTING)
      const pieces = board.getPieces()
      
      // Test a bishop (should have 0 moves - blocked by pawns)
      const c1Bishop = pieces.find(p => p.square === 'c1')
      expect(c1Bishop).toBeDefined()
      const bishopFreedom = metric.calculate(c1Bishop!, board)
      expect(bishopFreedom).toBe(0)
    })

    it('should return correct freedom after piece moves', () => {
      // After 1.e4, the e4 pawn should have 1 move (e4-e5) regardless of turn
      board = new ChessBoard(CHESS_POSITIONS.AFTER_E4)
      const pieces = board.getPieces()
      
      const e4Pawn = pieces.find(p => p.square === 'e4')
      expect(e4Pawn).toBeDefined()
      const pawnFreedom = metric.calculate(e4Pawn!, board)
      expect(pawnFreedom).toBe(1) // Can move to e5 regardless of whose turn it is
    })

    it('should return freedom for both colors regardless of turn', () => {
      board = new ChessBoard(CHESS_POSITIONS.STARTING)
      const pieces = board.getPieces()
      
      // Test white and black pawns in starting position
      const whitePawn = pieces.find(p => p.color === 'white' && p.square === 'e2')
      const blackPawn = pieces.find(p => p.color === 'black' && p.square === 'e7')
      
      expect(whitePawn).toBeDefined()
      expect(blackPawn).toBeDefined()
      
      // Both should have 2 freedom regardless of whose turn it is
      expect(metric.calculate(whitePawn!, board)).toBe(2)
      expect(metric.calculate(blackPawn!, board)).toBe(2)
    })


    it ('should return correct freedom for en passant case', () => {
      board = new ChessBoard(CHESS_POSITIONS.EN_PASSANT)
      const pieces = board.getPieces()

      const e5Pawn = pieces.find(p => p.square === 'e5')
      expect(e5Pawn).toBeDefined()
      expect(metric.calculate(e5Pawn!, board)).toBe(2)
    })
  })

})
