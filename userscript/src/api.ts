import { ChessMetricsResponse } from './types'
import { ChessBoard } from './shared/core/chess/ChessBoard'
import { MetricCalculator } from './shared/core/metric/MetricCalculator'
import { Chess } from 'chess.js'
import { LichessIntegration } from './sites/lichess'
import { MoveTracker } from './sites/lichess/move-tracker'

export class ChessMetricsAPI {
  private lichessIntegration: LichessIntegration
  private moveTracker: MoveTracker | null = null

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

  /**
   * Start tracking move navigation and automatically analyze positions
   */
  startMoveTracking(): string {
    try {
      if (!this.lichessIntegration.isLichessPage()) {
        return "Move tracking only available on Lichess pages"
      }

      if (this.moveTracker) {
        return "Move tracking is already active"
      }

      this.moveTracker = new MoveTracker({
        onMoveChange: (fen: string, ply: number) => {
          console.log(`🎯 MoveTracker: Position changed to ply ${ply}`)
          this.analyzeCurrentPosition(fen, ply)
        },
        onBoardChange: (boardElement: HTMLElement) => {
          console.log(`🎯 MoveTracker: Board element changed`)
        },
        debounceMs: 150
      })

      this.moveTracker.start()
      return "Move tracking started! Navigate through moves to see automatic analysis."
    } catch (error) {
      console.error("Error starting move tracking:", error)
      return `Error starting move tracking: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }

  /**
   * Stop tracking move navigation
   */
  stopMoveTracking(): string {
    try {
      if (!this.moveTracker) {
        return "Move tracking is not active"
      }

      this.moveTracker.stop()
      this.moveTracker = null
      return "Move tracking stopped"
    } catch (error) {
      console.error("Error stopping move tracking:", error)
      return `Error stopping move tracking: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }

  /**
   * Check if move tracking is active
   */
  isMoveTrackingActive(): boolean {
    return this.moveTracker !== null
  }

  /**
   * Analyze the current position and log results
   */
  private analyzeCurrentPosition(fen: string, ply: number): void {
    try {
      const analysis = this.standard.fen(fen)
      console.log(`📊 Analysis for ply ${ply}:`, analysis)
      
      // Log key metrics
      console.log(`🎯 Key Metrics:`)
      console.log(`  - Turn: ${analysis.players.white.isMyTurn ? 'White' : 'Black'}`)
      
      // Log piece metrics
      const hangingPieces = analysis.pieces.filter(p => p.isHanging).length
      const totalPieces = analysis.pieces.length
      const averageFreedom = analysis.pieces.reduce((sum, p) => sum + p.freedom, 0) / totalPieces
      console.log(`  - Total Pieces: ${totalPieces}`)
      console.log(`  - Hanging Pieces: ${hangingPieces}`)
      console.log(`  - Average Freedom: ${averageFreedom.toFixed(2)}`)
      
      // Log square metrics
      const totalSquares = analysis.squares.length
      const attackedSquares = analysis.squares.filter(s => s.numberOfWhiteAttackers > 0 || s.numberOfBlackAttackers > 0).length
      console.log(`  - Attacked Squares: ${attackedSquares}/${totalSquares}`)
      
    } catch (error) {
      console.warn(`Failed to analyze position at ply ${ply}:`, error)
    }
  }
}
