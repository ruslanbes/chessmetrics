import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import { ChessBoard } from './core/chess/board'
import { MetricCalculator } from './core/metric/calculator'
import { ChessMetricsResponse, ApiError } from './types/api'

const app = express()
const PORT = process.env['PORT'] || 3000

// Middleware
app.use(helmet())
app.use(cors())
app.use(compression())
app.use(morgan('combined'))
app.use(express.json())

// Helper function to validate FEN format
function isValidFenFormat(fen: string): boolean {
  if (!fen || typeof fen !== 'string') {
    return false
  }
  
  // Basic FEN format validation
  // A valid FEN has 6 space-separated parts
  const parts = fen.trim().split(' ')
  if (parts.length !== 6) {
    return false
  }
  
  // Check if the first part (board position) contains only valid characters
  const boardPart = parts[0]
  if (!boardPart) return false
  const validChars = /^[rnbqkpRNBQKP1-8/]+$/
  if (!validChars.test(boardPart)) {
    return false
  }
  
  // Check if the second part (active color) is 'w' or 'b'
  if (!parts[1] || !['w', 'b'].includes(parts[1])) {
    return false
  }
  
  // Check if the third part (castling rights) contains only valid characters
  const castlingPart = parts[2]
  if (!castlingPart) return false
  const validCastling = /^[KQkq-]+$/
  if (!validCastling.test(castlingPart)) {
    return false
  }
  
  // Check if the fourth part (en passant) is a valid square or '-'
  const enPassantPart = parts[3]
  if (!enPassantPart) return false
  const validEnPassant = /^([a-h][36]|-)$/
  if (!validEnPassant.test(enPassantPart)) {
    return false
  }
  
  // Check if the fifth and sixth parts (halfmove and fullmove clocks) are numbers
  if (!parts[4] || !parts[5] || !/^\d+$/.test(parts[4]) || !/^\d+$/.test(parts[5])) {
    return false
  }
  
  return true
}

// Helper function to sanitize user input for error messages
function sanitizeForError(input: string): string {
  if (!input || typeof input !== 'string') {
    return '[invalid input]'
  }
  
  // Remove or escape potentially dangerous characters
  return input
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML/XML injection
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:/gi, '') // Remove data: protocol
    .replace(/vbscript:/gi, '') // Remove vbscript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers like onclick=
    .replace(/eval\s*\(/gi, '') // Remove eval( calls
    .replace(/function\s*\(/gi, '') // Remove function( calls
    .replace(/setTimeout\s*\(/gi, '') // Remove setTimeout( calls
    .replace(/setInterval\s*\(/gi, '') // Remove setInterval( calls
    .replace(/document\./gi, '') // Remove document. calls
    .replace(/window\./gi, '') // Remove window. calls
    .replace(/alert\s*\(/gi, '') // Remove alert( calls
    .replace(/confirm\s*\(/gi, '') // Remove confirm( calls
    .replace(/prompt\s*\(/gi, '') // Remove prompt( calls
    .replace(/\.\.\//g, '') // Remove ../ path traversal
    .replace(/\.\.\\/g, '') // Remove ..\ path traversal
    .replace(/['"]/g, '') // Remove quotes
    .replace(/[;]/g, '') // Remove semicolons
    .replace(/[()]/g, '') // Remove parentheses
    .replace(/[{}]/g, '') // Remove braces
    .replace(/[\[\]]/g, '') // Remove brackets
    .replace(/[`]/g, '') // Remove backticks
    .replace(/[\\]/g, '') // Remove backslashes
    .substring(0, 100) // Limit length to prevent huge error messages
}

// Health check endpoint
app.get('/api/v1/health', (_req, res) => {
  res.json({
    status: 'healthy',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// Chess analysis endpoints
app.get('/api/v1/standard/fen/:fen', (req, res) => {
  try {
    const fen = decodeURIComponent(req.params.fen)
    
    // Validate FEN format first
    if (!isValidFenFormat(fen)) {
      const error: ApiError = {
        error: {
          code: 'INVALID_FEN',
          message: `Invalid FEN string format: ${sanitizeForError(fen)}`
        },
        timestamp: new Date().toISOString()
      }
      return res.status(400).json(error)
    }
    
    // Create chess board
    const board = new ChessBoard(fen)
    if (!board.isValid()) {
      const error: ApiError = {
        error: {
          code: 'INVALID_FEN',
          message: `Invalid chess position: ${sanitizeForError(fen)}`
        },
        timestamp: new Date().toISOString()
      }
      return res.status(400).json(error)
    }

    // Calculate metrics
    const calculator = new MetricCalculator()
    const result = calculator.calculate(board)

    // Build response
    const response: ChessMetricsResponse = {
      version: '1.0.0',
      fen: board.getFen(),
      gameType: 'standard',
      pieces: result.pieces,
      players: result.players
    }

    return res.json(response)
  } catch (error) {
    console.error('Error analyzing FEN:', error)
    const apiError: ApiError = {
      error: {
        code: 'ANALYSIS_ERROR',
        message: 'Error analyzing chess position'
      },
      timestamp: new Date().toISOString()
    }
    return res.status(500).json(apiError)
  }
})

app.get('/api/v1/standard/pgn/:pgn', (req, res) => {
  res.json({
    message: 'Chess PGN analysis endpoint - coming soon!',
    pgn: req.params.pgn
  })
})

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found'
    },
    timestamp: new Date().toISOString()
  })
})

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error'
    },
    timestamp: new Date().toISOString()
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Chessmetrics API server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/v1/health`)
  console.log(`♟️  FEN analysis: http://localhost:${PORT}/api/v1/standard/fen/{fen}`)
  console.log(`📝 PGN analysis: http://localhost:${PORT}/api/v1/standard/pgn/{pgn}`)
})
