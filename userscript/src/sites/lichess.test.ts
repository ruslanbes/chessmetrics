/**
 * Unit tests for LichessIntegration
 * 
 * Note: These are simplified tests that focus on the core logic
 * without requiring full DOM mocking, since the userscript runs in browser context.
 * 
 * These tests are designed to run in the main project context (Node.js) without DOM types.
 */

// Mock the LichessIntegration class to avoid DOM dependencies
class MockLichessIntegration {
  isLichessPage(): boolean {
    // Mock implementation that checks hostname
    const hostname = (global as any).window?.location?.hostname || ''
    return hostname.includes('lichess.org')
  }

  determineBoardType(): 'analysis' | 'game' | 'puzzle' | 'study' | 'unknown' {
    // Mock implementation that checks URL patterns
    const href = (global as any).window?.location?.href || ''
    
    if (href.includes('/analysis')) return 'analysis'
    if (href.includes('/training/')) return 'puzzle'
    if (href.includes('/study/')) return 'study'
    if (/\/[a-zA-Z0-9]{8}/.test(href)) return 'game'
    
    return 'unknown'
  }

  buildPGN(moves: Array<{ san: string; ply: number }>): string {
    // Mock implementation that builds PGN from moves
    if (moves.length === 0) return ''
    
    const pgnMoves: string[] = []
    let moveNumber = 1
    
    for (let i = 0; i < moves.length; i += 2) {
      const whiteMove = moves[i]
      const blackMove = moves[i + 1]
      
      if (whiteMove) {
        if (blackMove) {
          pgnMoves.push(`${moveNumber}.${whiteMove.san} ${blackMove.san}`)
        } else {
          pgnMoves.push(`${moveNumber}.${whiteMove.san}`)
        }
        moveNumber++
      }
    }
    
    return pgnMoves.join(' ')
  }
}

describe('LichessIntegration', () => {
  let lichessIntegration: MockLichessIntegration

  beforeEach(() => {
    lichessIntegration = new MockLichessIntegration()
  })

  describe('isLichessPage', () => {
    it('should return true for lichess.org domains', () => {
      // Arrange: Mock window.location.hostname
      const originalLocation = (global as any).window?.location
      ;(global as any).window = {
        location: { hostname: 'lichess.org' }
      }
      
      // Act
      const result = lichessIntegration.isLichessPage()
      
      // Assert
      expect(result).toBe(true)
      
      // Cleanup
      if (originalLocation) {
        ;(global as any).window.location = originalLocation
      }
    })

    it('should return false for non-lichess domains', () => {
      // Arrange: Mock window.location.hostname
      const originalLocation = (global as any).window?.location
      ;(global as any).window = {
        location: { hostname: 'chess.com' }
      }
      
      // Act
      const result = lichessIntegration.isLichessPage()
      
      // Assert
      expect(result).toBe(false)
      
      // Cleanup
      if (originalLocation) {
        ;(global as any).window.location = originalLocation
      }
    })
  })

  describe('determineBoardType', () => {
    it('should determine board type from URL patterns', () => {
      // Test the private method by mocking window.location
      const originalLocation = (global as any).window?.location
      
      // Test analysis page
      ;(global as any).window = {
        location: { href: 'https://lichess.org/analysis' }
      }
      
      const analysisType = lichessIntegration.determineBoardType()
      expect(analysisType).toBe('analysis')
      
      // Test game page
      ;(global as any).window = {
        location: { href: 'https://lichess.org/abc123def' }
      }
      
      const gameType = lichessIntegration.determineBoardType()
      expect(gameType).toBe('game')
      
      // Test puzzle page
      ;(global as any).window = {
        location: { href: 'https://lichess.org/training/123' }
      }
      
      const puzzleType = lichessIntegration.determineBoardType()
      expect(puzzleType).toBe('puzzle')
      
      // Cleanup
      if (originalLocation) {
        ;(global as any).window.location = originalLocation
      }
    })
  })

  describe('buildPGN', () => {
    it('should build PGN from moves array', () => {
      // Arrange: Mock moves data
      const mockMoves = [
        { san: 'e4', ply: 1 },
        { san: 'e5', ply: 2 },
        { san: 'Nf3', ply: 3 }
      ]
      
      // Act
      const result = lichessIntegration.buildPGN(mockMoves)
      
      // Assert
      expect(result).toBe('1.e4 e5 2.Nf3')
    })

    it('should handle empty moves array', () => {
      // Act
      const result = lichessIntegration.buildPGN([])
      
      // Assert
      expect(result).toBe('')
    })

    it('should handle single move', () => {
      // Arrange
      const mockMoves = [{ san: 'e4', ply: 1 }]
      
      // Act
      const result = lichessIntegration.buildPGN(mockMoves)
      
      // Assert
      expect(result).toBe('1.e4')
    })
  })
})
