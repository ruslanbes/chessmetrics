import { ChessMetricsResponse } from './types'
import { ChessBoard } from './shared/core/chess/board'
import { MetricCalculator } from './shared/core/metric/calculator'
import { Chess } from 'chess.js'

export class ChessMetricsAPI {
  standard = {
    fen: (fenString: string): ChessMetricsResponse => {
      try {
        // Create chess board from FEN
        const board = new ChessBoard(fenString)
        
        // Validate the position
        if (!board.isValid()) {
          throw new Error(`Invalid chess position: ${fenString}`)
        }
        
        // Calculate metrics using the copied core logic
        const calculator = new MetricCalculator()
        const result = calculator.calculate(board)
        
        // Build response
        return {
          version: '1.0.0',
          fen: board.getFen(),
          gameType: 'standard',
          pieces: result.pieces,
          players: result.players,
          squares: result.squares
        }
      } catch (error) {
        // Return error response
        throw new Error(`Failed to analyze position: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
  }
}
