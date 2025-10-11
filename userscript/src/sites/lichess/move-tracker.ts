/**
 * MoveTracker - Monitors Lichess move navigation and triggers callbacks
 */

export interface MoveTrackerOptions {
  onMoveChange?: (fen: string, ply: number) => void
  onBoardChange?: (boardElement: HTMLElement) => void
  debounceMs?: number
  debug?: boolean
}

export class MoveTracker {
  private options: MoveTrackerOptions
  private currentFen: string | null = null
  private currentPly: number | null = null
  private debounceTimer: number | null = null
  private isTracking = false
  private mutationObserver: MutationObserver | null = null
  private eventListeners: Array<{ element: EventTarget; event: string; handler: EventListenerOrEventListenerObject }> = []

  constructor(options: MoveTrackerOptions = {}) {
    this.options = {
      debounceMs: 100,
      debug: false,
      ...options
    }
  }

  /**
   * Debug logging helper - only logs if debug is enabled
   */
  private debugLog(...args: any[]): void {
    if (this.options.debug) {
      console.log(...args)
    }
  }

  /**
   * Start tracking move navigation
   */
  start(): void {
    if (this.isTracking) return
    
    this.isTracking = true
    this.debugLog('🎯 MoveTracker: Starting move navigation tracking')
    
    this.setupKeyboardListeners()
    this.setupDOMListeners()
    this.setupGlobalObjectMonitoring()
    this.setupMutationObserver()
    this.setupPubSubListener()
  }

  /**
   * Stop tracking move navigation
   */
  stop(): void {
    if (!this.isTracking) return
    
    this.isTracking = false
    this.debugLog('🎯 MoveTracker: Stopping move navigation tracking')
    
    this.cleanupEventListeners()
    this.cleanupMutationObserver()
    this.cleanupDebounceTimer()
  }

  /**
   * Setup keyboard event listeners for navigation
   */
  private setupKeyboardListeners(): void {
    const keyboardHandler = (e: Event) => {
      const keyEvent = e as KeyboardEvent
      const navigationKeys = [
        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
        ' ', 'Space', 'j', 'k', 'h', 'l', 'Home', 'End'
      ]
      
      if (navigationKeys.includes(keyEvent.key) || navigationKeys.includes(keyEvent.code)) {
        this.handleNavigationChange('keyboard', keyEvent.key)
      }
    }

    document.addEventListener('keydown', keyboardHandler)
    this.eventListeners.push({ element: document, event: 'keydown', handler: keyboardHandler })
  }

  /**
   * Setup DOM event listeners for move clicks and navigation buttons
   */
  private setupDOMListeners(): void {
    // Listen for clicks on move elements
    const moveClickHandler = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'MOVE' || target.classList.contains('move')) {
        this.handleNavigationChange('move-click', target.textContent || '')
      }
    }

    // Listen for navigation button clicks
    const navButtonHandler = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'BUTTON' && this.isNavigationButton(target)) {
        this.handleNavigationChange('nav-button', target.dataset.act || target.textContent || '')
      }
    }

    // Listen for mouse events that might indicate navigation
    const mouseHandler = (e: Event) => {
      // Small delay to allow DOM updates after navigation
      setTimeout(() => {
        this.handleNavigationChange('mouse', 'mouse-event')
      }, 50)
    }

    document.addEventListener('click', moveClickHandler)
    document.addEventListener('click', navButtonHandler)
    document.addEventListener('mouseup', mouseHandler)
    
    this.eventListeners.push(
      { element: document, event: 'click', handler: moveClickHandler },
      { element: document, event: 'click', handler: navButtonHandler },
      { element: document, event: 'mouseup', handler: mouseHandler }
    )
  }

  /**
   * Check if a button is a navigation button
   */
  private isNavigationButton(button: HTMLElement): boolean {
    const navActions = ['first', 'prev', 'next', 'last', 'backward', 'forward']
    const dataAct = button.dataset.act
    const className = button.className
    const text = button.textContent?.toLowerCase()
    
    return !!(
      (dataAct && navActions.includes(dataAct)) ||
      className.includes('nav') ||
      className.includes('arrow') ||
      (text && (text.includes('<<') || text.includes('>>') || text.includes('<') || text.includes('>')))
    )
  }

  /**
   * Setup monitoring of Lichess global objects
   */
  private setupGlobalObjectMonitoring(): void {
    const checkGlobalObjects = () => {
      if (!this.isTracking) return
      
      try {
        const lichess = (window as any).lichess
        const chessground = (window as any).chessground
        
        if (lichess && lichess.analysis) {
          // Monitor analysis controller for path changes
          const analysis = lichess.analysis
          if (analysis.path && analysis.path !== this.currentPly) {
            this.handleNavigationChange('global-analysis', `ply-${analysis.path}`)
          }
        }
        
        if (chessground && chessground.state) {
          // Monitor chessground state changes
          const state = chessground.state
          if (state.fen && state.fen !== this.currentFen) {
            this.handleNavigationChange('chessground', state.fen)
          }
        }
      } catch (error) {
        // Silently handle errors accessing global objects
      }
      
      // Check again after a short delay
      setTimeout(checkGlobalObjects, 200)
    }
    
    checkGlobalObjects()
  }

  /**
   * Setup MutationObserver to watch for DOM changes
   */
  private setupMutationObserver(): void {
    this.mutationObserver = new MutationObserver((mutations) => {
      let shouldCheck = false
      
      mutations.forEach((mutation) => {
        // Check for changes in move list or active move indicators
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'class' || mutation.attributeName === 'data-ply')) {
          shouldCheck = true
        }
        
        if (mutation.type === 'childList') {
          // Check if move elements were added/removed
          const addedMoves = Array.from(mutation.addedNodes).some(node => 
            node.nodeType === Node.ELEMENT_NODE && 
            ((node as Element).tagName === 'MOVE' || (node as Element).classList.contains('move'))
          )
          
          if (addedMoves) {
            shouldCheck = true
          }
        }
      })
      
      if (shouldCheck) {
        this.handleNavigationChange('mutation', 'dom-change')
      }
    })
    
    // Observe the entire document for changes
    this.mutationObserver.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['class', 'data-ply', 'data-fen']
    })
  }

  /**
   * Setup listener for Lichess pubsub events
   */
  private setupPubSubListener(): void {
    // Try to access Lichess pubsub system
    try {
      const lichess = (window as any).lichess
      if (lichess && lichess.pubsub) {
        lichess.pubsub.on('ply', (ply: number) => {
          this.handleNavigationChange('pubsub', `ply-${ply}`)
        })
      }
    } catch (error) {
      // Silently handle if pubsub is not available
    }
  }

  /**
   * Handle navigation change with debouncing
   */
  private handleNavigationChange(source: string, details: string): void {
    if (!this.isTracking) return
    
    // Debounce rapid changes
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }
    
    this.debounceTimer = window.setTimeout(() => {
      this.processNavigationChange(source, details)
    }, this.options.debounceMs)
  }

  /**
   * Process the actual navigation change
   */
  private processNavigationChange(source: string, details: string): void {
    try {
      // Try to get current FEN from various sources
      const fen = this.getCurrentFen()
      const ply = this.getCurrentPly()
      
      if (fen && fen !== this.currentFen) {
        this.debugLog(`🎯 MoveTracker: Position changed via ${source} (${details})`)
        this.debugLog(`📊 New FEN: ${fen}`)
        this.debugLog(`📍 New Ply: ${ply}`)
        
        this.currentFen = fen
        this.currentPly = ply
        
        // Trigger callbacks
        this.options.onMoveChange?.(fen, ply || 0)
        
        // Try to get board element
        const boardElement = this.getBoardElement()
        if (boardElement) {
          this.options.onBoardChange?.(boardElement)
        }
      }
    } catch (error) {
      console.warn('MoveTracker: Error processing navigation change:', error)
    }
  }

  /**
   * Get current FEN from various sources
   */
  private getCurrentFen(): string | null {
    try {
      // Try chessground first
      const chessground = (window as any).chessground
      if (chessground?.state?.fen) {
        return chessground.state.fen
      }
      
      // Try lichess analysis
      const lichess = (window as any).lichess
      if (lichess?.analysis?.node?.fen) {
        return lichess.analysis.node.fen
      }
      
      // Try DOM data attributes
      const boardElement = this.getBoardElement()
      if (boardElement) {
        const dataFen = boardElement.getAttribute('data-fen')
        if (dataFen) return dataFen
        
        // Check for FEN in parent elements
        let parent = boardElement.parentElement
        while (parent && parent !== document.body) {
          const parentFen = parent.getAttribute('data-fen')
          if (parentFen) return parentFen
          parent = parent.parentElement
        }
      }
      
      // Try to find FEN in script tags or other elements
      const fenElements = document.querySelectorAll('[data-fen]')
      if (fenElements.length > 0) {
        return fenElements[0].getAttribute('data-fen')
      }
      
    } catch (error) {
      // Silently handle errors
    }
    
    return null
  }

  /**
   * Get current ply from various sources
   */
  private getCurrentPly(): number | null {
    try {
      // Try lichess analysis
      const lichess = (window as any).lichess
      if (lichess?.analysis?.path) {
        return lichess.analysis.path.length
      }
      
      // Try to find active move element
      const activeMove = document.querySelector('.active[data-ply]')
      if (activeMove) {
        const ply = activeMove.getAttribute('data-ply')
        if (ply) return parseInt(ply, 10)
      }
      
    } catch (error) {
      // Silently handle errors
    }
    
    return null
  }

  /**
   * Get the current board element
   */
  private getBoardElement(): HTMLElement | null {
    // Try common board selectors
    const selectors = [
      '.cg-wrap',
      '.cg-board-wrap',
      '.board',
      '[data-board]',
      '.chessground'
    ]
    
    for (const selector of selectors) {
      const element = document.querySelector(selector) as HTMLElement
      if (element) return element
    }
    
    return null
  }

  /**
   * Cleanup event listeners
   */
  private cleanupEventListeners(): void {
    this.eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler)
    })
    this.eventListeners = []
  }

  /**
   * Cleanup mutation observer
   */
  private cleanupMutationObserver(): void {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect()
      this.mutationObserver = null
    }
  }

  /**
   * Cleanup debounce timer
   */
  private cleanupDebounceTimer(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = null
    }
  }
}
