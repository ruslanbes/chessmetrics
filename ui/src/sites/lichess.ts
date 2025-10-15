/**
 * Lichess.org integration for Chessmetrics
 * 
 * This file now serves as a compatibility layer for the refactored Lichess integration.
 * The actual implementation has been moved to the lichess/ directory using the Strategy pattern.
 */

// Re-export everything from the new structure for backward compatibility
export { 
  LichessIntegration,
  type LichessBoard,
  type LichessMove
} from './lichess/index'