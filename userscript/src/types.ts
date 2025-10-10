// Re-export types from the main app
// This will be replaced with copied types later

export interface ChessMetricsResponse {
  version: string
  fen: string
  gameType: 'standard'
  pieces: PieceMetrics[]
  players: {
    white: PlayerMetrics
    black: PlayerMetrics
  }
}

export interface PlayerMetrics {
  isMyTurn: boolean
}

export interface PieceMetrics {
  type: string
  color: string
  square: string
  isAttacked: boolean
  isHanging: boolean
  numberOfAttackers: number
  freedom: number
}
