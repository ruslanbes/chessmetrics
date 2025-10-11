import { ChessBoard } from '../chess/ChessBoard'
import { METRIC_REGISTRY, METRIC_METADATA, MetricClass } from './registry'
import { PlayerMetrics, PieceMetrics, SquareMetrics } from '../../types/api'
import { Piece, Square } from '../../types/chess'

export class MetricCalculator {
  private metricInstances: Map<string, MetricClass> = new Map()

  constructor() {
    this.initializeMetrics()
  }

  /**
   * Initialize all metric instances from the registry
   */
  private initializeMetrics(): void {
    for (const [, metricClasses] of Object.entries(METRIC_REGISTRY)) {
      for (const MetricClass of metricClasses) {
        const instance = new MetricClass()
        // Get the metric name from metadata using the class name
        const className = MetricClass.name
        const fullName = this.findMetricNameByClassName(className)
        if (fullName) {
          this.metricInstances.set(fullName, instance)
        }
      }
    }
  }

  private findMetricNameByClassName(className: string): string | null {
    for (const category of Object.values(METRIC_METADATA)) {
      for (const [name, metadata] of Object.entries(category)) {
        if (metadata.className === className) {
          return name
        }
      }
    }
    return null
  }

  /**
   * Calculate all metrics for a chess position
   */
  calculate(board: ChessBoard): {
    players: { white: PlayerMetrics; black: PlayerMetrics }
    pieces: PieceMetrics[]
    squares: SquareMetrics[]
  } {
    // Calculate player metrics dynamically
    const whiteMetrics = this.calculatePlayerMetrics('white', board)
    const blackMetrics = this.calculatePlayerMetrics('black', board)

    // Calculate piece metrics
    const pieces = board.getPieces()
    const pieceMetrics: PieceMetrics[] = pieces.map(piece => 
      this.calculatePieceMetrics(piece, board)
    )

    // Calculate square metrics for all 64 squares
    const squareMetrics: SquareMetrics[] = this.calculateSquareMetrics(board)

    return {
      players: {
        white: whiteMetrics,
        black: blackMetrics
      },
      pieces: pieceMetrics,
      squares: squareMetrics
    }
  }

  /**
   * Calculate player metrics for a specific color
   */
  private calculatePlayerMetrics(color: 'white' | 'black', board: ChessBoard): PlayerMetrics {
    const metrics: any = {}
    
    // Get all player metrics from registry
    const playerMetrics = METRIC_REGISTRY.player || []
    
    for (const MetricClass of playerMetrics) {
      // Get the metric name from metadata using the class name
      const className = MetricClass.name
      const fullName = this.findMetricNameByClassName(className)
      
      if (fullName) {
        const instance = this.metricInstances.get(fullName)
        if (instance) {
          const result = instance.calculate(board, { player: color, board })
          // Extract metric name from full name (e.g., "player.isMyTurn" -> "isMyTurn")
          const metricName = fullName.split('.')[1]
          if (metricName) {
            metrics[metricName] = result
          }
        }
      }
    }
    
    return metrics as PlayerMetrics
  }

  /**
   * Calculate metrics for a single piece
   */
  private calculatePieceMetrics(piece: Piece, board: ChessBoard): PieceMetrics {
    const metrics: any = {
      // Basic piece data
      type: piece.type,
      color: piece.color,
      square: piece.square
    }
    
    // Get all piece metrics from registry
    const pieceMetrics = METRIC_REGISTRY.piece || []
    
    for (const MetricClass of pieceMetrics) {
      // Get the metric name from metadata using the class name
      const className = MetricClass.name
      const fullName = this.findMetricNameByClassName(className)
      
      if (fullName) {
        const instance = this.metricInstances.get(fullName)
        if (instance) {
          const result = instance.calculate(piece, board)
          // Extract metric name from full name (e.g., "piece.isAttacked" -> "isAttacked")
          const metricName = fullName.split('.')[1]
          if (metricName) {
            metrics[metricName] = result
          }
        }
      }
    }
    
    return metrics as PieceMetrics
  }

  /**
   * Calculate metrics for all 64 squares
   */
  private calculateSquareMetrics(board: ChessBoard): SquareMetrics[] {
    const allSquares: Square[] = [
      'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8',
      'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
      'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6',
      'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5',
      'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4',
      'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3',
      'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
      'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'
    ]

    return allSquares.map(square => this.calculateSquareMetricsForSquare(square, board))
  }

  /**
   * Calculate metrics for a single square
   */
  private calculateSquareMetricsForSquare(square: Square, board: ChessBoard): SquareMetrics {
    const metrics: any = {
      square: square
    }

    // Get all square metrics from registry
    const squareMetrics = METRIC_REGISTRY.square || []

    for (const MetricClass of squareMetrics) {
      // Get the metric name from metadata using the class name
      const className = MetricClass.name
      const fullName = this.findMetricNameByClassName(className)

      if (fullName) {
        const instance = this.metricInstances.get(fullName)
        if (instance) {
          const result = instance.calculate(square, board)
          // Extract metric name from full name (e.g., "square.numberOfWhiteAttackers" -> "numberOfWhiteAttackers")
          const metricName = fullName.split('.')[1]
          if (metricName) {
            metrics[metricName] = result
          }
        }
      }
    }

    return metrics as SquareMetrics
  }

}
