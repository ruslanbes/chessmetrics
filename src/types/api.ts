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
  
  // Calculated metrics are auto-discovered and added dynamically
  // See MetricRegistry.ts for available metrics
}

export interface SquareMetrics {
  square: Square
  
  // Calculated metrics are auto-discovered and added dynamically
  // See MetricRegistry.ts for available metrics
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
