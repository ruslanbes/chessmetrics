// API request/response types
import { PieceType, Color, Square } from './chess'
export interface AnalyzeRequest {
  fen: string
}

// Response types
export interface ChessMetricsResponse {
  version: string
  fen: string
  gameType: 'standard'
  pieces: PieceMetrics[]
  players: {
    white: PlayerMetrics
    black: PlayerMetrics
  }
  squares: SquareMetrics[]
}

export interface PlayerMetrics {
  isMyTurn: boolean
}

export interface PieceMetrics {
  // Basic piece data
  type: PieceType
  color: Color
  square: Square
  
  // Calculated metrics
  isAttacked: boolean
  isHanging: boolean
  numberOfAttackers: number
  freedom: number
}

export interface SquareMetrics {
  square: Square
  numberOfWhiteAttackers: number
  numberOfBlackAttackers: number
}

// Error types
export interface ApiError {
  error: {
    code: string
    message: string
    details?: string
  }
  timestamp: string
}
