import { ChessMetricsResponse } from './types'
import { ChessBoard } from './shared/core/chess/ChessBoard'
import { MetricCalculator } from './shared/core/metric/MetricCalculator'
import { Chess } from 'chess.js'
import { LichessIntegration } from './sites/lichess'

export class ChessMetricsAPI {
  private lichessIntegration: LichessIntegration

  constructor() {
    this.lichessIntegration = new LichessIntegration()
  }

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

  /**
   * Detect and analyze the current chess board position
   */
  detectBoard(): string {
    try {
      // Check if we're on a Lichess page
      if (!this.lichessIntegration.isLichessPage()) {
        return "No board found - not on Lichess"
      }

      // Try to detect the board
      const board = this.lichessIntegration.detectBoard()
      if (!board) {
        return "No board found"
      }

      // Extract PGN if available
      const pgn = this.lichessIntegration.extractPGN()
      if (pgn) {
        board.pgn = pgn
      }

      // Get board info
      const info = this.lichessIntegration.getBoardInfo(board)
      
      // Log the result with detailed debugging info
      console.log("🎯 Lichess board detected:", {
        type: board.type,
        source: board.source,
        hasFen: !!board.fen,
        hasPgn: !!board.pgn,
        fen: board.fen,
        pgn: board.pgn,
        info,
        debug: {
          url: window.location.href,
          boardElement: board.element,
          boardClasses: board.element.className,
          lichessGlobal: !!(window as any).lichess,
          chessgroundGlobal: !!(window as any).chessground
        }
      })

      // If we have a FEN, analyze it
      if (board.fen) {
        try {
          const analysis = this.standard.fen(board.fen)
          console.log("📊 Board analysis:", analysis)
          return `Board detected: ${board.type} (${board.source}) - FEN: ${board.fen}`
        } catch (error) {
          console.warn("Failed to analyze FEN:", error)
          return `Board detected: ${board.type} (${board.source}) - FEN: ${board.fen} (analysis failed)`
        }
      }

      return `Board detected: ${board.type} (${board.source}) - no FEN available`
    } catch (error) {
      console.error("Error detecting board:", error)
      return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }

  /**
   * Debug method to inspect what's available on the current page
   */
  debugPage(): string {
    try {
      if (!this.lichessIntegration.isLichessPage()) {
        return "Not on a Lichess page"
      }

      const debugInfo = this.lichessIntegration.debugPageInfo()
      console.log("🔍 Page debug info:", debugInfo)
      
      return `Debug info logged to console. Available elements: ${JSON.stringify(debugInfo, null, 2)}`
    } catch (error) {
      console.error("Error in debug:", error)
      return `Debug error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}
