/**
 * Board detection logic for Lichess pages
 */

import { LichessBoard } from './types'

export class LichessBoardDetector {
  /**
   * Detect chess board from global objects
   */
  detectFromGlobalObjects(): LichessBoard | null {
    try {
      const lichess = (window as any).lichess
      if (!lichess) {
        return null
      }

      // Try analysis page
      if (lichess.analysis?.chessground?.state?.fen) {
        const analysis = lichess.analysis
        return {
          element: document.createElement('div'), // Placeholder element
          fen: analysis.chessground.state.fen,
          type: 'analysis',
          source: 'global'
        }
      }

      // Try game page
      if (lichess.game?.chessground?.state?.fen) {
        return {
          element: document.createElement('div'), // Placeholder element
          fen: lichess.game.chessground.state.fen,
          type: 'game',
          source: 'global'
        }
      }

      return null
    } catch (error) {
      console.warn('Failed to detect board from global objects:', error)
      return null
    }
  }

  /**
   * Detect chess board from Chessground elements
   */
  detectFromChessground(): LichessBoard | null {
    try {
      const chessgroundBoard = document.querySelector('.cg-board-wrap') as HTMLElement
      if (chessgroundBoard) {
        return {
          element: chessgroundBoard,
          type: this.determineBoardType(),
          source: 'chessground'
        }
      }

      const cgWrap = document.querySelector('.cg-wrap') as HTMLElement
      if (cgWrap) {
        return {
          element: cgWrap,
          type: this.determineBoardType(),
          source: 'chessground'
        }
      }

      return null
    } catch (error) {
      console.warn('Failed to detect board from chessground:', error)
      return null
    }
  }

  /**
   * Detect chess board from generic DOM elements
   */
  detectFromDOM(): LichessBoard | null {
    try {
      const genericBoard = document.querySelector('.board, .chess-board') as HTMLElement
      if (genericBoard) {
        return {
          element: genericBoard,
          type: this.determineBoardType(),
          source: 'dom'
        }
      }

      return null
    } catch (error) {
      console.warn('Failed to detect board from DOM:', error)
      return null
    }
  }

  /**
   * Determine board type based on URL and page elements
   */
  determineBoardType(): 'analysis' | 'game' | 'puzzle' | 'study' | 'unknown' {
    const url = window.location.href

    // Check for specific page types
    if (url.includes('/analysis')) {
      return 'analysis'
    }

    if (url.includes('/training/')) {
      return 'puzzle'
    }

    if (url.includes('/study/')) {
      return 'study'
    }

    // Check for game page (8-character game ID)
    const gameIdMatch = window.location.pathname.match(/^\/([a-zA-Z0-9]{8})(?:\/white|\/black)?$/)
    if (gameIdMatch) {
      return 'game'
    }

    // Check for game page elements
    if (this.isGamePage()) {
      return 'game'
    }

    return 'unknown'
  }

  /**
   * Check if current page is a game page
   */
  private isGamePage(): boolean {
    const selectors = [
      '.game',
      '.game-board',
      '.clock',
      '.player',
      '.move-list',
      '.analyse__moves'
    ]

    for (const selector of selectors) {
      if (document.querySelector(selector)) {
        return true
      }
    }

    return false
  }
}
