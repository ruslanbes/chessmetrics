import { ChessMetricsResponse } from '../types'
import { OverlayEngine } from './OverlayEngine'
import { BoardAdapter } from './BoardAdapter'
import { PinnedPieceVisualizer } from './visualizers/PinnedPieceVisualizer'
import { OverlayOptions } from './types'

export class OverlayManager {
  private engine: OverlayEngine
  private isActive: boolean = false

  constructor(adapter: BoardAdapter, options: OverlayOptions = {}) {
    this.engine = new OverlayEngine(adapter, options)
    
    // Register default visualizers
    this.engine.registerVisualizer(new PinnedPieceVisualizer())
  }

  start(): void {
    this.isActive = true
  }

  stop(): void {
    this.isActive = false
    this.engine.clear()
  }

  updateMetrics(metrics: ChessMetricsResponse): void {
    if (!this.isActive) return
    
    this.engine.render(metrics)
  }

  destroy(): void {
    this.engine.destroy()
    this.isActive = false
  }
}
