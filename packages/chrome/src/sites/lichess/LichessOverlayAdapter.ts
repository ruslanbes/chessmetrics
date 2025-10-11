import { BoardAdapter } from '../../overlay/BoardAdapter'
import { Square } from '../../types'
import { SquarePosition } from '../../overlay/types'

export class LichessOverlayAdapter implements BoardAdapter {
  getName(): string {
    return 'Lichess (Chessground)'
  }

  findBoardElement(): HTMLElement | null {
    // Try multiple selectors for Chessground board
    const selectors = ['cg-board', '.cg-board', 'cg-container']
    for (const selector of selectors) {
      const element = document.querySelector(selector)
      if (element) return element as HTMLElement
    }
    return null
  }

  getBoardOrientation(): 'white' | 'black' {
    // Check board classes for orientation
    const cgWrap = document.querySelector('.cg-wrap')
    if (cgWrap?.classList.contains('orientation-black')) {
      return 'black'
    }
    return 'white'
  }

  squareToPosition(square: Square, orientation: 'white' | 'black'): SquarePosition {
    const file = square.charCodeAt(0) - 97 // a=0, b=1, etc.
    const rank = parseInt(square[1]) - 1    // 1=0, 2=1, etc.
    
    // Calculate position based on board orientation (Chessground uses 12.5% per square)
    const top = orientation === 'white' ? (7 - rank) * 12.5 : rank * 12.5
    const left = orientation === 'white' ? file * 12.5 : (7 - file) * 12.5
    
    return { top: `${top}%`, left: `${left}%` }
  }

  createOverlayContainer(): HTMLElement {
    const container = document.createElement('div')
    container.className = 'chessmetrics-overlay-container'
    container.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 5;
    `
    return container
  }

  attachContainer(board: HTMLElement, container: HTMLElement): void {
    board.appendChild(container)
  }
}
