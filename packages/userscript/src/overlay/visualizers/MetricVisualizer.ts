import { ChessMetricsResponse } from '../../types'
import { SquareOverlay } from '../types'

export interface MetricVisualizer {
  /**
   * Generate overlay data from metrics response
   */
  visualize(metrics: ChessMetricsResponse): SquareOverlay[]
  
  /**
   * Get CSS styles needed for this visualizer
   */
  getStyles(): string
  
  /**
   * Visualizer name for identification
   */
  getName(): string
}
