/**
 * Types and interfaces for Lichess integration
 */

export interface LichessBoard {
  element: HTMLElement
  fen?: string
  pgn?: string
  type: 'analysis' | 'game' | 'puzzle' | 'study' | 'unknown'
  source: 'global' | 'dom' | 'chessground'
}

export interface LichessMove {
  san: string
  path: string
  ply: number
  isActive: boolean
}

export interface FenExtractionResult {
  fen?: string
  source: 'global' | 'dom' | 'chessground' | 'url' | 'script' | 'reconstruction' | 'none'
}
