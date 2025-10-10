import { IsHangingMetric } from './isHanging'
import { ChessBoard } from '../../../core/chess/board'
import { CHESS_POSITIONS } from '../../../../tests/fixtures/chess-positions'

describe('IsHangingMetric', () => {
  let metric: IsHangingMetric
  let board: ChessBoard

  beforeEach(() => {
    metric = new IsHangingMetric()
  })

  describe('Basic functionality', () => {
    it('should return false for starting position pieces (no hanging pieces)', () => {
      board = new ChessBoard(CHESS_POSITIONS.STARTING)
      const pieces = board.getPieces()
      
      // Test a few pieces from starting position
      const whitePawn = pieces.find(p => p.color === 'white' && p.type === 'pawn')
      const blackPawn = pieces.find(p => p.color === 'black' && p.type === 'pawn')
      
      expect(whitePawn).toBeDefined()
      expect(blackPawn).toBeDefined()
      
      // In starting position, pieces are not hanging
      expect(metric.calculate(whitePawn!, board)).toBe(false)
      expect(metric.calculate(blackPawn!, board)).toBe(false)
    })

    it('should correctly identify hanging pieces in Petrov Defence', () => {
      board = new ChessBoard(CHESS_POSITIONS.PETROV_DEFENCE)
      const pieces = board.getPieces()
      
      // Find the pawns on e4 and e5
      const e4Pawn = pieces.find(p => p.color === 'white' && p.square === 'e4')
      const e5Pawn = pieces.find(p => p.color === 'black' && p.square === 'e5')
      
      expect(e4Pawn).toBeDefined()
      expect(e5Pawn).toBeDefined()
      
      // Both e4 and e5 pawns should be hanging in Petrov Defence
      expect(metric.calculate(e4Pawn!, board)).toBe(true)
      expect(metric.calculate(e5Pawn!, board)).toBe(true)
    })

    it('should return false for defended pieces', () => {
      board = new ChessBoard(CHESS_POSITIONS.AFTER_E4_E5)
      const pieces = board.getPieces()
      
      // Find pieces that should be defended
      const whitePawn = pieces.find(p => p.color === 'white' && p.type === 'pawn')
      const blackPawn = pieces.find(p => p.color === 'black' && p.type === 'pawn')
      
      expect(whitePawn).toBeDefined()
      expect(blackPawn).toBeDefined()
      
      // These pieces should not be hanging (they have defenders)
      expect(metric.calculate(whitePawn!, board)).toBe(false)
      expect(metric.calculate(blackPawn!, board)).toBe(false)
    })

    it('should return false for pieces with no attackers', () => {
      board = new ChessBoard(CHESS_POSITIONS.STARTING)
      const pieces = board.getPieces()
      
      // Test pieces that have no attackers at all
      const whiteKing = pieces.find(p => p.color === 'white' && p.type === 'king')
      const blackKing = pieces.find(p => p.color === 'black' && p.type === 'king')
      
      expect(whiteKing).toBeDefined()
      expect(blackKing).toBeDefined()
      
      // Kings in starting position should not be hanging
      expect(metric.calculate(whiteKing!, board)).toBe(false)
      expect(metric.calculate(blackKing!, board)).toBe(false)
    })
  })

})

