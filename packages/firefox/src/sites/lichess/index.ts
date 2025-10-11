/**
 * Lichess integration module exports
 */

export { LichessIntegration } from './lichess-integration'
export { LichessBoardDetector } from './board-detector'
export { LichessFenExtractor } from './fen-extractor'
export { LichessPgnBuilder } from './pgn-builder'
export { LichessDomUtils } from './dom-utils'

// Export types
export type { LichessBoard, LichessMove, FenExtractionResult } from './types'

// Export strategies
export { ChessgroundFenExtractor } from './strategies/chessground-fen-extractor'
export { DomAttributeFenExtractor } from './strategies/dom-attribute-fen-extractor'
export { UrlFenExtractor } from './strategies/url-fen-extractor'
export { PageDataFenExtractor } from './strategies/page-data-fen-extractor'
export { MoveFenExtractor } from './strategies/move-fen-extractor'
export { BoardReconstructionFenExtractor } from './strategies/board-reconstruction-fen-extractor'

// Export strategy interface
export type { FenExtractionStrategy } from './fen-extraction-strategy'
