import { MetricVisualizer } from './MetricVisualizer'
import { ChessMetricsResponse } from '../../types'
import { SquareOverlay } from '../types'

export class PinnedPieceVisualizer implements MetricVisualizer {
  getName(): string {
    return 'pinned-pieces'
  }

  visualize(metrics: ChessMetricsResponse): SquareOverlay[] {
    const overlays: SquareOverlay[] = []
    
    for (const piece of metrics.pieces) {
      if ((piece as any).isPinned) {
        overlays.push({
          square: piece.square,
          content: '📍', // Unicode pin
          className: 'chessmetrics-pinned'
        })
      }
    }
    
    return overlays
  }

  getStyles(): string {
    return `
      .chessmetrics-pinned {
        font-size: 1.5em;
        line-height: 1;
        pointer-events: none;
        z-index: 10;
        text-shadow: 0 0 3px white, 0 0 5px white;
      }
    `
  }
}
