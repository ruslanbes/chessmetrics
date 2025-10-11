import { Square } from '../types'
import { SquarePosition } from './types'

export interface BoardAdapter {
  /**
   * Find the main board element in the DOM
   */
  findBoardElement(): HTMLElement | null
  
  /**
   * Get current board orientation
   */
  getBoardOrientation(): 'white' | 'black'
  
  /**
   * Convert square notation to CSS position
   * @param square - Square notation (e.g., "e4")
   * @param orientation - Board orientation
   */
  squareToPosition(square: Square, orientation: 'white' | 'black'): SquarePosition
  
  /**
   * Create overlay container element
   */
  createOverlayContainer(): HTMLElement
  
  /**
   * Attach container to board
   * @param board - Board element
   * @param container - Container to attach
   */
  attachContainer(board: HTMLElement, container: HTMLElement): void
  
  /**
   * Get adapter name for debugging
   */
  getName(): string
}
