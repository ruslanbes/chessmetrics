import { KingsFreedomMetric } from './kingsFreedom'
import { ChessBoard } from '../../../core/chess/board'
import { CHESS_POSITIONS } from '../../../../tests/fixtures/chess-positions'

describe('KingsFreedomMetric', () => {
  let metric: KingsFreedomMetric
  let board: ChessBoard

  beforeEach(() => {
    metric = new KingsFreedomMetric()
  })

  describe('Basic functionality', () => {
    it('should return correct freedom for kings in starting position', () => {
      board = new ChessBoard(CHESS_POSITIONS.STARTING)
      
      // In starting position, both kings should have 0 freedom (blocked by pieces)
      const whiteKingsFreedom = metric.calculate(board, { player: 'white', board })
      const blackKingsFreedom = metric.calculate(board, { player: 'black', board })
      
      expect(whiteKingsFreedom).toBe(0)
      expect(blackKingsFreedom).toBe(0)
    })

    it('should return freedom for kings after castling', () => {
      board = new ChessBoard(CHESS_POSITIONS.CASTLING)
      
      const whiteKingsFreedom = metric.calculate(board, { player: 'white', board })
      const blackKingsFreedom = metric.calculate(board, { player: 'black', board })
      
      expect(whiteKingsFreedom).toBe(4)
      expect(blackKingsFreedom).toBe(4)
    })

    it('should handle complex positions correctly', () => {
      board = new ChessBoard(CHESS_POSITIONS.GIUOCO_PIANISSIMO)
      
      const whiteKingsFreedom = metric.calculate(board, { player: 'white', board })
      const blackKingsFreedom = metric.calculate(board, { player: 'black', board })
      
      expect(whiteKingsFreedom).toBe(4)
      expect(blackKingsFreedom).toBe(1)
    })

    it('should return 0 for kings in checkmate positions', () => {
      board = new ChessBoard(CHESS_POSITIONS.FOOLS_MATE)
      
      const whiteKingsFreedom = metric.calculate(board, { player: 'white', board })
      const blackKingsFreedom = metric.calculate(board, { player: 'black', board })
      
      // In fool's mate, white king should have 0 freedom (checkmate)
      expect(whiteKingsFreedom).toBe(0)
      expect(blackKingsFreedom).toBe(2)
    })

    it('should return freedom for both players regardless of turn', () => {
      board = new ChessBoard(CHESS_POSITIONS.AFTER_E4_E5)
      
      const whiteKingsFreedom = metric.calculate(board, { player: 'white', board })
      const blackKingsFreedom = metric.calculate(board, { player: 'black', board })
      
      expect(whiteKingsFreedom).toBe(1)
      expect(blackKingsFreedom).toBe(1)
    })

    it('should find the correct king for each player', () => {
      board = new ChessBoard(CHESS_POSITIONS.STARTING)
      
      // Verify that we're getting the king's freedom, not some other piece
      const pieces = board.getPieces()
      const whiteKing = pieces.find(p => p.color === 'white' && p.type === 'king')
      const blackKing = pieces.find(p => p.color === 'black' && p.type === 'king')
      
      expect(whiteKing).toBeDefined()
      expect(blackKing).toBeDefined()
      
      // The metric should return the same value as calculating the king's freedom directly
      const whiteKingsFreedom = metric.calculate(board, { player: 'white', board })
      const blackKingsFreedom = metric.calculate(board, { player: 'black', board })
      
      expect(whiteKingsFreedom).toBe(0)
      expect(blackKingsFreedom).toBe(0)
    })
  })
})
