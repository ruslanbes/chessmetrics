/**
 * Main Lichess integration class that orchestrates all components
 */

import { LichessBoard } from './types'
import { LichessBoardDetector } from './board-detector'
import { LichessFenExtractor } from './fen-extractor'
import { LichessPgnBuilder } from './pgn-builder'
import { LichessDomUtils } from './dom-utils'

export class LichessIntegration {
  private boardDetector: LichessBoardDetector
  private fenExtractor: LichessFenExtractor
  private pgnBuilder: LichessPgnBuilder
  private domUtils: LichessDomUtils

  constructor() {
    this.boardDetector = new LichessBoardDetector()
    this.fenExtractor = new LichessFenExtractor()
    this.pgnBuilder = new LichessPgnBuilder()
    this.domUtils = new LichessDomUtils()
  }

  /**
   * Detect if we're on a Lichess page with a chess board
   */
  detectBoard(): LichessBoard | null {
    // Method 1: Try global object access (most reliable)
    const globalBoard = this.boardDetector.detectFromGlobalObjects()
    if (globalBoard) {
      // Extract FEN if not already present
      if (!globalBoard.fen) {
        globalBoard.fen = this.fenExtractor.extractFen(globalBoard.element)
      }
      return globalBoard
    }

    // Method 2: Try Chessground elements
    const chessgroundBoard = this.boardDetector.detectFromChessground()
    if (chessgroundBoard) {
      chessgroundBoard.fen = this.fenExtractor.extractFen(chessgroundBoard.element)
      return chessgroundBoard
    }

    // Method 3: Try generic DOM elements
    const domBoard = this.boardDetector.detectFromDOM()
    if (domBoard) {
      domBoard.fen = this.fenExtractor.extractFen(domBoard.element)
      return domBoard
    }

    return null
  }

  /**
   * Check if we're on a Lichess page
   */
  isLichessPage(): boolean {
    return this.domUtils.isLichessPage()
  }

  /**
   * Get comprehensive debug information about the current page
   */
  debugPageInfo(): Record<string, any> {
    const lichess = (window as any).lichess
    const chessground = (window as any).chessground
    
    return {
      url: window.location.href,
      hasLichessGlobal: !!lichess,
      hasChessgroundGlobal: !!chessground,
      lichessKeys: lichess ? Object.keys(lichess) : [],
      chessgroundKeys: chessground ? Object.keys(chessground) : [],
      boardElements: this.domUtils.getBoardElementCounts(),
      dataAttributes: this.domUtils.findDataAttributes(),
      scriptTags: this.domUtils.findScriptTagsWithFen()
    }
  }

  /**
   * Extract PGN from the current page
   */
  extractPGN(): string | undefined {
    return this.pgnBuilder.extractPGNFromMoves()
  }

  /**
   * Get debug information about FEN extraction for a specific element
   */
  debugFenExtraction(element: HTMLElement): Array<{ strategy: string; canExtract: boolean; result: any }> {
    return this.fenExtractor.debugFenExtraction(element)
  }

  /**
   * Get board information for debugging
   */
  getBoardInfo(board: LichessBoard): Record<string, any> {
    return {
      element: {
        tagName: board.element.tagName,
        className: board.element.className,
        id: board.element.id
      },
      type: board.type,
      source: board.source,
      hasFen: !!board.fen,
      hasPgn: !!board.pgn,
      fenLength: board.fen?.length || 0,
      pgnLength: board.pgn?.length || 0
    }
  }
}
