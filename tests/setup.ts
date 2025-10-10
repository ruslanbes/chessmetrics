// Global test setup
import { jest } from '@jest/globals'

// Global test utilities
global.testUtils = {
  // Helper to create test FENs
  createTestFEN: (position: string, turn: 'w' | 'b' = 'w') => {
    return `${position} ${turn} KQkq - 0 1`
  },
  
  // Helper to create test board
  createTestBoard: (fen: string) => {
    const { ChessBoard } = require('../src/core/chess/board')
    return new ChessBoard(fen)
  }
}

// Mock console methods in tests to reduce noise
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
}

// Extend Jest matchers if needed
expect.extend({
  toBeValidFEN(received: string) {
    const fenRegex = /^[rnbqkpRNBQKP1-8]+\/[rnbqkpRNBQKP1-8]+\/[rnbqkpRNBQKP1-8]+\/[rnbqkpRNBQKP1-8]+\/[rnbqkpRNBQKP1-8]+\/[rnbqkpRNBQKP1-8]+\/[rnbqkpRNBQKP1-8]+\/[rnbqkpRNBQKP1-8]+ [wb] [KQkq-]+ [a-h1-8-]+ \d+ \d+$/
    const pass = fenRegex.test(received)
    
    return {
      message: () => `expected ${received} ${pass ? 'not ' : ''}to be a valid FEN`,
      pass
    }
  }
})

// Declare global types
declare global {
  var testUtils: {
    createTestFEN: (position: string, turn?: 'w' | 'b') => string
    createTestBoard: (fen: string) => any
  }
  
  namespace jest {
    interface Matchers<R> {
      toBeValidFEN(): R
    }
  }
}
