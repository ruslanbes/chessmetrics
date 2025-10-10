import { ChessBoard } from '../chess/board'
import { METRIC_REGISTRY, METRIC_METADATA, MetricClass } from './registry'
import { PlayerMetrics, PieceMetrics } from '../../types/api'
import { Piece } from '../../types/chess'

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
  } {
    // Calculate player metrics dynamically
    const whiteMetrics = this.calculatePlayerMetrics('white', board)
    const blackMetrics = this.calculatePlayerMetrics('black', board)

    // Calculate piece metrics
    const pieces = board.getPieces()
    const pieceMetrics: PieceMetrics[] = pieces.map(piece => 
      this.calculatePieceMetrics(piece, board)
    )

    return {
      players: {
        white: whiteMetrics,
        black: blackMetrics
      },
      pieces: pieceMetrics
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

}
