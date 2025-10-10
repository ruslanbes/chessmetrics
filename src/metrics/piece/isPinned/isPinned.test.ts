import { IsPinnedMetric } from './isPinned'
import { ChessBoard } from '../../../core/chess/board'
import { CHESS_POSITIONS, ENDINGS, MIDDLEGAMES } from '../../../../tests/fixtures/chess-positions'

describe('IsPinnedMetric', () => {
  let metric: IsPinnedMetric
  let board: ChessBoard

  beforeEach(() => {
    metric = new IsPinnedMetric()
  })

  describe('Basic functionality', () => {
    it('should return false for starting position pieces (no pinned pieces)', () => {
      board = new ChessBoard(CHESS_POSITIONS.STARTING)
      const pieces = board.getPieces()
      
      // Test a few pieces from starting position
      const whitePawn = pieces.find(p => p.color === 'white' && p.type === 'pawn' && p.square === 'e2')
      const blackPawn = pieces.find(p => p.color === 'black' && p.type === 'pawn' && p.square === 'e7')
      const whiteRook = pieces.find(p => p.color === 'white' && p.type === 'rook' && p.square === 'a1')
      const blackRook = pieces.find(p => p.color === 'black' && p.type === 'rook' && p.square === 'a8')
      
      expect(whitePawn).toBeDefined()
      expect(blackPawn).toBeDefined()
      expect(whiteRook).toBeDefined()
      expect(blackRook).toBeDefined()
      
      // In starting position, pieces are not pinned
      expect(metric.calculate(whitePawn!, board)).toBe(false)
      expect(metric.calculate(blackPawn!, board)).toBe(false)
      expect(metric.calculate(whiteRook!, board)).toBe(false)
      expect(metric.calculate(blackRook!, board)).toBe(false)
    })

    it('should correctly identify that black rooks are not pinned in MIDDLEGAME_1 position', () => {
      board = new ChessBoard(MIDDLEGAMES.MIDDLEGAME_1)
      const pieces = board.getPieces()
      
      // Find the black rooks on c8 and f8
      const blackRookC8 = pieces.find(p => p.color === 'black' && p.type === 'rook' && p.square === 'c8')
      const blackRookF8 = pieces.find(p => p.color === 'black' && p.type === 'rook' && p.square === 'f8')
      
      expect(blackRookC8).toBeDefined()
      expect(blackRookF8).toBeDefined()
      
      // These rooks should NOT be pinned - they are on the same rank as the king
      // but there's no enemy piece attacking along the line between them and the king
      expect(metric.calculate(blackRookC8!, board)).toBe(false)
      expect(metric.calculate(blackRookF8!, board)).toBe(false)
    })

    it('should work for the position where the pieces stare at each other', () => {
      board = new ChessBoard(ENDINGS.ROOKS_AND_KINGS)
      const pieces = board.getPieces()
      
      const blackRook = pieces.find(p => p.color === 'black' && p.type === 'rook' && p.square === 'f4')
      const whiteRook = pieces.find(p => p.color === 'white' && p.type === 'rook' && p.square === 'c4')
      expect(blackRook).toBeDefined()
      expect(whiteRook).toBeDefined()

      expect(metric.calculate(blackRook!, board)).toBe(true)
      expect(metric.calculate(whiteRook!, board)).toBe(false)
    })
  })
})
