import { ChessMetricsResponse } from '../types'
import { SquareOverlay, OverlayOptions } from './types'
import { BoardAdapter } from './BoardAdapter'
import { MetricVisualizer } from './visualizers/MetricVisualizer'

export class OverlayEngine {
  private boardElement: HTMLElement | null = null
  private overlayContainer: HTMLElement | null = null
  private styleElement: HTMLStyleElement | null = null
  private visualizers: MetricVisualizer[] = []
  private options: OverlayOptions
  private adapter: BoardAdapter

  constructor(adapter: BoardAdapter, options: OverlayOptions = {}) {
    this.adapter = adapter
    this.options = { debug: false, ...options }
    
    if (this.options.debug) {
      console.log(`OverlayEngine: Initialized with ${adapter.getName()} adapter`)
    }
  }

  registerVisualizer(visualizer: MetricVisualizer): void {
    this.visualizers.push(visualizer)
    this.injectStyles(visualizer.getStyles())
    
    if (this.options.debug) {
      console.log(`OverlayEngine: Registered visualizer: ${visualizer.getName()}`)
    }
  }

  render(metrics: ChessMetricsResponse): void {
    if (!this.boardElement) {
      this.boardElement = this.adapter.findBoardElement()
      if (!this.boardElement) {
        if (this.options.debug) {
          console.warn(`OverlayEngine: Board element not found (${this.adapter.getName()})`)
        }
        return
      }
    }

    // Clear existing overlays
    this.clear()

    // Create overlay container if needed
    if (!this.overlayContainer) {
      this.overlayContainer = this.adapter.createOverlayContainer()
      this.adapter.attachContainer(this.boardElement, this.overlayContainer)
    }

    const orientation = this.adapter.getBoardOrientation()

    // Collect overlays from all visualizers
    const allOverlays: SquareOverlay[] = []
    for (const visualizer of this.visualizers) {
      const overlays = visualizer.visualize(metrics)
      allOverlays.push(...overlays)
    }

    // Render each overlay
    for (const overlay of allOverlays) {
      const position = this.adapter.squareToPosition(overlay.square, orientation)
      const element = document.createElement('div')
      element.className = `chessmetrics-overlay ${overlay.className}`
      element.textContent = overlay.content
      element.style.cssText = `
        position: absolute;
        top: ${position.top};
        left: ${position.left};
        width: 12.5%;
        height: 12.5%;
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
      `
      element.setAttribute('data-square', overlay.square)
      this.overlayContainer.appendChild(element)
    }

    if (this.options.debug) {
      console.log(`OverlayEngine: Rendered ${allOverlays.length} overlays`)
    }
  }

  clear(): void {
    if (this.overlayContainer) {
      this.overlayContainer.innerHTML = ''
    }
  }

  destroy(): void {
    if (this.overlayContainer?.parentNode) {
      this.overlayContainer.parentNode.removeChild(this.overlayContainer)
    }
    if (this.styleElement?.parentNode) {
      this.styleElement.parentNode.removeChild(this.styleElement)
    }
    this.overlayContainer = null
    this.boardElement = null
    this.styleElement = null
    this.visualizers = []
  }

  private injectStyles(css: string): void {
    if (!this.styleElement) {
      this.styleElement = document.createElement('style')
      this.styleElement.id = 'chessmetrics-overlay-styles'
      document.head.appendChild(this.styleElement)
    }
    this.styleElement.textContent += css
  }
}
