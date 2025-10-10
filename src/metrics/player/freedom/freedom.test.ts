import { PlayerFreedomMetric } from './freedom'
import { ChessBoard } from '../../../core/chess/board'
import { CHESS_POSITIONS } from '../../../../tests/fixtures/chess-positions'

describe('PlayerFreedomMetric', () => {
  let metric: PlayerFreedomMetric
  let board: ChessBoard

  beforeEach(() => {
    metric = new PlayerFreedomMetric()
  })

  describe('Basic functionality', () => {
    it('should return correct freedom for starting position', () => {
      board = new ChessBoard(CHESS_POSITIONS.STARTING)
      
      // In starting position, both players should have the same freedom
      const whiteFreedom = metric.calculate(board, { player: 'white', board })
      const blackFreedom = metric.calculate(board, { player: 'black', board })
      
      expect(whiteFreedom).toEqual(20)
      expect(blackFreedom).toEqual(20)
    })

    it('should return different freedoms after moves', () => {
      board = new ChessBoard(CHESS_POSITIONS.AFTER_E4)
      
      const whiteFreedom = metric.calculate(board, { player: 'white', board })
      const blackFreedom = metric.calculate(board, { player: 'black', board })
      
      // After e4, both players should have freedom (turn doesn't matter)
      expect(whiteFreedom).toEqual(30)
      expect(blackFreedom).toEqual(20)
      // They may have different freedoms due to the position change
    })

    it('should handle complex positions correctly', () => {
      board = new ChessBoard(CHESS_POSITIONS.GIUOCO_PIANISSIMO)
      
      const whiteFreedom = metric.calculate(board, { player: 'white', board })
      const blackFreedom = metric.calculate(board, { player: 'black', board })
      
      expect(whiteFreedom).toBeGreaterThanOrEqual(0)
      expect(blackFreedom).toBeGreaterThanOrEqual(0)
    })

    it('should return 0 for positions with no legal moves', () => {
      // Use a position where one player has no legal moves (checkmate)
      board = new ChessBoard(CHESS_POSITIONS.FOOLS_MATE)
      
      const whiteFreedom = metric.calculate(board, { player: 'white', board })
      const blackFreedom = metric.calculate(board, { player: 'black', board })
      
      // In fool's mate, White has no legal moves (checkmate)
      expect(whiteFreedom).toBe(0)
      expect(blackFreedom).toBeGreaterThan(0) // Black should still have moves available
    })

    it('should sum freedoms of all player pieces correctly', () => {
      board = new ChessBoard(CHESS_POSITIONS.STARTING)
      
      // Get individual piece freedoms to verify the sum
      const pieces = board.getPieces()
      const whitePieces = pieces.filter(p => p.color === 'white')
      
      // Get all moves for both colors
      const allMoves = board.getAllMoves()
      
      let expectedWhiteFreedom = 0
      for (const piece of whitePieces) {
        const pieceMoves = allMoves.filter(move => 
          move.from === piece.square && move.color === 'white'
        )
        expectedWhiteFreedom += pieceMoves.length
      }
      
      const actualWhiteFreedom = metric.calculate(board, { player: 'white', board })
      expect(actualWhiteFreedom).toBe(expectedWhiteFreedom)
    })

    it('should return freedom for both players regardless of turn', () => {
      // Test a position where we can verify both players have moves
      board = new ChessBoard(CHESS_POSITIONS.AFTER_E4_E5)
      
      const whiteFreedom = metric.calculate(board, { player: 'white', board })
      const blackFreedom = metric.calculate(board, { player: 'black', board })
      
      expect(whiteFreedom).toBeGreaterThan(0)
      expect(blackFreedom).toBeGreaterThan(0) // Both players should have freedom regardless of turn
    })
  })
})
