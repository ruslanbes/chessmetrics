import { Chess } from 'chess.js'
import { Color } from '../../types/chess'

export class BoardStateManager {
  constructor(private chess: Chess) {}

  /**
   * Get the current turn (whose move it is)
   */
  getTurn(): Color {
    return this.chess.turn() === 'w' ? 'white' : 'black'
  }

  /**
   * Get the current FEN string
   */
  getFen(): string {
    return this.chess.fen()
  }

  /**
   * Check if the position is valid
   */
  isValid(): boolean {
    try {
      return this.chess.isGameOver() === false || this.chess.isCheckmate() || this.chess.isStalemate()
    } catch {
      return false
    }
  }

  /**
   * Get ASCII representation of the board (delegates to chess.js)
   */
  getAscii(): string {
    return this.chess.ascii()
  }

  /**
   * Get 2D array representation of the board (delegates to chess.js)
   */
  getBoardArray(): any[][] {
    return this.chess.board()
  }
}
