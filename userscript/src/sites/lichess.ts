/**
 * Lichess.org integration for Chessmetrics
 * Detects chess boards and extracts FEN/PGN from Lichess pages
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

export class LichessIntegration {
  /**
   * Detect if we're on a Lichess page with a chess board
   */
  detectBoard(): LichessBoard | null {
    // Method 1: Try global object access (most reliable)
    const globalBoard = this.detectFromGlobalObjects()
    if (globalBoard) {
      return globalBoard
    }

    // Method 2: Try chessground detection
    const chessgroundBoard = this.detectFromChessground()
    if (chessgroundBoard) {
      return chessgroundBoard
    }

    // Method 3: Try DOM-based detection
    const domBoard = this.detectFromDOM()
    if (domBoard) {
      return domBoard
    }

    return null
  }

  /**
   * Extract FEN from Lichess global objects
   */
  private detectFromGlobalObjects(): LichessBoard | null {
    try {
      // Check for analysis controller
      const lichess = (window as any).lichess
      if (lichess?.analysis) {
        // Analysis page - try to access the controller
        // Note: The public API is limited, but we can try to access internal properties
        const analysis = lichess.analysis
        
        // Try to find the chessground instance
        const chessground = this.findChessgroundInstance()
        if (chessground) {
          return {
            element: chessground,
            fen: this.extractFenFromChessground(chessground),
            type: this.determineBoardType(),
            source: 'global'
          }
        }
      }

      // Check for other global objects
      if (lichess?.chessground) {
        return {
          element: lichess.chessground,
          fen: this.extractFenFromChessground(lichess.chessground),
          type: this.determineBoardType(),
          source: 'global'
        }
      }
    } catch (error) {
      console.warn('Failed to access Lichess global objects:', error)
    }

    return null
  }

  /**
   * Detect board from chessground instances
   */
  private detectFromChessground(): LichessBoard | null {
    // Primary detection: Chessground board wrapper
    const chessgroundBoard = document.querySelector('.cg-board-wrap') as HTMLElement
    if (chessgroundBoard) {
      return {
        element: chessgroundBoard,
        fen: this.extractFenFromChessground(chessgroundBoard),
        type: this.determineBoardType(),
        source: 'chessground'
      }
    }

    // Alternative detection: cg-wrap class
    const cgWrap = document.querySelector('.cg-wrap') as HTMLElement
    if (cgWrap) {
      return {
        element: cgWrap,
        fen: this.extractFenFromChessground(cgWrap),
        type: this.determineBoardType(),
        source: 'chessground'
      }
    }

    return null
  }

  /**
   * Detect board from DOM elements
   */
  private detectFromDOM(): LichessBoard | null {
    // Look for generic board classes
    const genericBoard = document.querySelector('.board, .chess-board') as HTMLElement
    if (genericBoard) {
      return {
        element: genericBoard,
        fen: this.extractFenFromDOM(genericBoard),
        type: this.determineBoardType(),
        source: 'dom'
      }
    }

    return null
  }

  /**
   * Extract FEN from chessground element
   */
  private extractFenFromChessground(element: HTMLElement): string | undefined {
    try {
      // Method 1: Try to access chessground state from various possible locations
      const chessground = (element as any).__chessground || 
                         (element as any).chessground ||
                         (element as any).cg
      
      if (chessground?.state?.fen) {
        return chessground.state.fen
      }

      // Method 2: Try to access Lichess global objects
      const lichess = (window as any).lichess
      if (lichess?.analysis?.chessground?.state?.fen) {
        return lichess.analysis.chessground.state.fen
      }

      // Method 3: Try to find chessground instance in global scope
      const globalChessground = this.findGlobalChessground()
      if (globalChessground?.state?.fen) {
        return globalChessground.state.fen
      }

      // Method 4: Check for pv_box element with data-fen (common on Lichess)
      const pvBox = document.querySelector('.pv_box[data-fen]')
      if (pvBox) {
        const pvFen = pvBox.getAttribute('data-fen')
        if (pvFen) {
          return pvFen
        }
      }

      // Method 4.5: Check for any element with data-fen attribute
      const anyFenElement = document.querySelector('[data-fen]')
      if (anyFenElement) {
        const anyFen = anyFenElement.getAttribute('data-fen')
        if (anyFen) {
          return anyFen
        }
      }

      // Method 5: Check data attributes on element and parents
      const fenAttr = element.getAttribute('data-fen')
      if (fenAttr) {
        return fenAttr
      }

      // Method 6: Look for FEN in parent elements
      let parent = element.parentElement
      while (parent && parent !== document.body) {
        const parentFen = parent.getAttribute('data-fen')
        if (parentFen) {
          return parentFen
        }
        parent = parent.parentElement
      }

      // Method 7: Try to extract from URL parameters
      const urlParams = new URLSearchParams(window.location.search)
      const fenParam = urlParams.get('fen')
      if (fenParam) {
        return fenParam
      }

      // Method 8: Try to extract from hash
      const hash = window.location.hash
      const fenMatch = hash.match(/fen=([^&]+)/)
      if (fenMatch) {
        return decodeURIComponent(fenMatch[1])
      }

      // Method 9: Try to extract from page data (for game pages)
      const pageData = this.extractFenFromPageData()
      if (pageData) {
        return pageData
      }

      // Method 10: Try to extract from move list (current position)
      const currentFen = this.extractCurrentFenFromMoves()
      if (currentFen) {
        return currentFen
      }

      // Method 11: Try to reconstruct FEN from board pieces
      const reconstructedFen = this.reconstructFenFromBoard(element)
      if (reconstructedFen) {
        return reconstructedFen
      }
    } catch (error) {
      console.warn('Failed to extract FEN from chessground:', error)
    }

    return undefined
  }

  /**
   * Extract FEN from DOM element
   */
  private extractFenFromDOM(element: HTMLElement): string | undefined {
    try {
      // Check data attributes
      const fenAttr = element.getAttribute('data-fen')
      if (fenAttr) {
        return fenAttr
      }

      // Check for FEN in nearby elements
      const fenElement = element.querySelector('[data-fen]') as HTMLElement
      if (fenElement) {
        return fenElement.getAttribute('data-fen') || undefined
      }
    } catch (error) {
      console.warn('Failed to extract FEN from DOM:', error)
    }

    return undefined
  }

  /**
   * Extract PGN from move list
   */
  extractPGN(): string | undefined {
    try {
      // Find move container
      const moveContainer = document.querySelector('.analyse__moves') as HTMLElement
      if (!moveContainer) {
        return undefined
      }

      // Extract moves
      const moves = this.extractMoves(moveContainer)
      if (moves.length === 0) {
        return undefined
      }

      // Build PGN
      return this.buildPGN(moves)
    } catch (error) {
      console.warn('Failed to extract PGN:', error)
      return undefined
    }
  }

  /**
   * Extract moves from move container
   */
  private extractMoves(container: HTMLElement): LichessMove[] {
    const moves: LichessMove[] = []
    const moveElements = container.querySelectorAll('.move')

    moveElements.forEach((moveEl, index) => {
      const sanElement = moveEl.querySelector('.san')
      if (sanElement) {
        const san = sanElement.textContent?.trim()
        const path = moveEl.getAttribute('p') || ''
        const isActive = moveEl.classList.contains('active')
        
        if (san) {
          moves.push({
            san,
            path,
            ply: index + 1,
            isActive
          })
        }
      }
    })

    return moves
  }

  /**
   * Build PGN from moves
   */
  private buildPGN(moves: LichessMove[]): string {
    const pgnMoves: string[] = []
    let moveNumber = 1

    for (let i = 0; i < moves.length; i++) {
      const move = moves[i]
      
      if (i % 2 === 0) {
        // White move
        pgnMoves.push(`${moveNumber}.${move.san}`)
      } else {
        // Black move
        pgnMoves.push(move.san)
        moveNumber++
      }
    }

    return pgnMoves.join(' ')
  }

  /**
   * Find chessground instance in the DOM
   */
  private findChessgroundInstance(): HTMLElement | null {
    // Try different selectors
    const selectors = [
      '.cg-board-wrap',
      '.cg-wrap',
      '.cg-board',
      '.chessground'
    ]

    for (const selector of selectors) {
      const element = document.querySelector(selector) as HTMLElement
      if (element) {
        return element
      }
    }

    return null
  }

  /**
   * Determine the type of board based on URL and page structure
   */
  private determineBoardType(): LichessBoard['type'] {
    const url = window.location.href
    
    if (url.includes('/analysis')) {
      return 'analysis'
    } else if (url.includes('/puzzle')) {
      return 'puzzle'
    } else if (url.includes('/study/')) {
      return 'study'
    } else if (url.includes('/game/') || url.includes('/embed/')) {
      return 'game'
    } else if (this.isGamePage()) {
      // Check if this is a game page by looking for game-specific elements
      return 'game'
    } else {
      return 'unknown'
    }
  }

  /**
   * Check if current page is a game page by looking for game-specific elements
   */
  private isGamePage(): boolean {
    // Look for game-specific elements
    const gameIndicators = [
      '.game',
      '.game-board',
      '.game-meta',
      '.game-info',
      '.clock',
      '.game-controls'
    ]

    for (const selector of gameIndicators) {
      if (document.querySelector(selector)) {
        return true
      }
    }

    // Check URL pattern for game IDs (8-character alphanumeric)
    const gameIdMatch = window.location.pathname.match(/^\/([a-zA-Z0-9]{8})(?:\/white|\/black)?$/)
    if (gameIdMatch) {
      return true
    }

    return false
  }

  /**
   * Check if we're on a Lichess page
   */
  isLichessPage(): boolean {
    return window.location.hostname.includes('lichess.org')
  }

  /**
   * Find chessground instance in global scope
   */
  private findGlobalChessground(): any {
    try {
      // Try various global object paths
      const lichess = (window as any).lichess
      if (lichess) {
        // Check analysis controller
        if (lichess.analysis?.chessground) {
          return lichess.analysis.chessground
        }
        
        // Check for other chessground instances
        if (lichess.chessground) {
          return lichess.chessground
        }
        
        // Check for game controller
        if (lichess.game?.chessground) {
          return lichess.game.chessground
        }
      }

      // Try to find chessground in window object
      const windowObj = window as any
      if (windowObj.chessground) {
        return windowObj.chessground
      }

      // Try to find it in document
      const chessgroundElements = document.querySelectorAll('[data-chessground]')
      for (const element of Array.from(chessgroundElements)) {
        const cg = (element as any).__chessground || (element as any).chessground
        if (cg?.state?.fen) {
          return cg
        }
      }
    } catch (error) {
      console.warn('Failed to find global chessground:', error)
    }

    return null
  }

  /**
   * Extract FEN from page data (for game pages)
   */
  private extractFenFromPageData(): string | undefined {
    try {
      // Look for page data in script tags
      const scripts = document.querySelectorAll('script')
      for (const script of Array.from(scripts)) {
        const content = script.textContent || script.innerHTML
        if (content && content.includes('fen')) {
          // Try to extract FEN from JSON data
          const fenMatch = content.match(/"fen"\s*:\s*"([^"]+)"/)
          if (fenMatch) {
            return fenMatch[1]
          }
        }
      }

      // Look for data attributes on body or html
      const bodyFen = document.body.getAttribute('data-fen')
      if (bodyFen) {
        return bodyFen
      }

      const htmlFen = document.documentElement.getAttribute('data-fen')
      if (htmlFen) {
        return htmlFen
      }
    } catch (error) {
      console.warn('Failed to extract FEN from page data:', error)
    }

    return undefined
  }

  /**
   * Extract current FEN from move list
   */
  private extractCurrentFenFromMoves(): string | undefined {
    try {
      // Find the active move in the move list
      const activeMove = document.querySelector('.move.active')
      if (activeMove) {
        // Try to get FEN from the active move's data attributes
        const fen = activeMove.getAttribute('data-fen')
        if (fen) {
          return fen
        }

        // Try to get FEN from parent move container
        const moveContainer = activeMove.closest('.moves')
        if (moveContainer) {
          const containerFen = moveContainer.getAttribute('data-fen')
          if (containerFen) {
            return containerFen
          }
        }
      }

      // Try to find FEN in the moves container
      const movesContainer = document.querySelector('.moves, .analyse__moves')
      if (movesContainer) {
        const movesFen = movesContainer.getAttribute('data-fen')
        if (movesFen) {
          return movesFen
        }
      }
    } catch (error) {
      console.warn('Failed to extract current FEN from moves:', error)
    }

    return undefined
  }

  /**
   * Reconstruct FEN from board pieces (fallback method)
   */
  private reconstructFenFromBoard(element: HTMLElement): string | undefined {
    try {
      // Look for piece elements
      const pieces = element.querySelectorAll('.piece, .cg-piece')
      if (pieces.length === 0) {
        return undefined
      }

      // Initialize empty board
      const board: (string | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null))

      // Map piece classes to FEN notation
      const pieceMap: Record<string, string> = {
        'wp': 'P', 'bp': 'p',
        'wr': 'R', 'br': 'r',
        'wn': 'N', 'bn': 'n',
        'wb': 'B', 'bb': 'b',
        'wq': 'Q', 'bq': 'q',
        'wk': 'K', 'bk': 'k'
      }

      // Extract piece positions
      Array.from(pieces).forEach(piece => {
        const pieceClass = piece.className
        const pieceMatch = pieceClass.match(/([wb][prnbqk])/)
        if (pieceMatch) {
          const pieceType = pieceMap[pieceMatch[1]]
          if (pieceType) {
            // Get position from data attributes or class
            const pos = piece.getAttribute('data-pos') || 
                       piece.getAttribute('data-square') ||
                       this.extractPositionFromClass(pieceClass)
            
            if (pos && pos.length === 2) {
              const file = pos.charCodeAt(0) - 97 // a=0, b=1, etc.
              const rank = 8 - parseInt(pos[1]) // 8=0, 7=1, etc.
              
              if (file >= 0 && file < 8 && rank >= 0 && rank < 8) {
                board[rank][file] = pieceType
              }
            }
          }
        }
      })

      // Convert board to FEN notation
      const fenRows: string[] = []
      for (let rank = 0; rank < 8; rank++) {
        let fenRow = ''
        let emptyCount = 0
        
        for (let file = 0; file < 8; file++) {
          const piece = board[rank][file]
          if (piece) {
            if (emptyCount > 0) {
              fenRow += emptyCount.toString()
              emptyCount = 0
            }
            fenRow += piece
          } else {
            emptyCount++
          }
        }
        
        if (emptyCount > 0) {
          fenRow += emptyCount.toString()
        }
        
        fenRows.push(fenRow)
      }

      // For now, return a basic FEN (we'd need more info for full FEN)
      // This is a simplified version - full FEN would need castling rights, en passant, etc.
      const position = fenRows.join('/')
      return `${position} w - - 0 1` // Default values for missing info
    } catch (error) {
      console.warn('Failed to reconstruct FEN from board:', error)
      return undefined
    }
  }

  /**
   * Extract position from piece class name
   */
  private extractPositionFromClass(className: string): string | undefined {
    // Look for position patterns in class names
    const posMatch = className.match(/([a-h][1-8])/)
    return posMatch ? posMatch[1] : undefined
  }

  /**
   * Get additional board information
   */
  getBoardInfo(board: LichessBoard): Record<string, any> {
    return {
      type: board.type,
      url: window.location.href,
      hasFen: !!board.fen,
      hasPgn: !!board.pgn,
      boardElement: board.element,
      source: board.source,
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Debug method to inspect what's available on the page
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
      boardElements: {
        cgWrap: document.querySelectorAll('.cg-wrap').length,
        cgBoardWrap: document.querySelectorAll('.cg-board-wrap').length,
        pieces: document.querySelectorAll('.piece, .cg-piece').length,
        moves: document.querySelectorAll('.move').length
      },
      dataAttributes: this.findDataAttributes(),
      scriptTags: this.findScriptTagsWithFen()
    }
  }

  /**
   * Find elements with FEN-related data attributes
   */
  private findDataAttributes(): any[] {
    const elements = document.querySelectorAll('[data-fen], [data-square], [data-pos]')
    return Array.from(elements).map(el => ({
      tag: el.tagName,
      classes: el.className,
      dataFen: el.getAttribute('data-fen'),
      dataSquare: el.getAttribute('data-square'),
      dataPos: el.getAttribute('data-pos')
    }))
  }

  /**
   * Find script tags that might contain FEN data
   */
  private findScriptTagsWithFen(): string[] {
    const scripts = document.querySelectorAll('script')
    const results: string[] = []
    
    Array.from(scripts).forEach((script, index) => {
      const content = script.textContent || script.innerHTML
      if (content && content.includes('fen')) {
        results.push(`Script ${index}: ${content.substring(0, 200)}...`)
      }
    })
    
    return results
  }
}
