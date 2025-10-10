import { Square, SquareUtils } from '../../types/chess'

interface BoardInterface {
  getAscii(): string
  getPieces(): any[]
  getAttackers(square: Square, color: string): Square[]
  getMoves(): any[]
  getAllMoves(): any[]
  getTurn(): string
  getFen(): string
  isValid(): boolean
}

export class BoardDebugger {
  constructor(private board: BoardInterface) {}

  /**
   * Debug helper: Print board with highlighted squares
   */
  debugBoard(highlightSquares: Square[] = []): string {
    const ascii = this.board.getAscii()
    if (highlightSquares.length === 0) {
      return ascii
    }
    
    // Simple highlighting by adding markers
    let result = ascii
    highlightSquares.forEach(square => {
      const coordinates = SquareUtils.toCoordinates(square)
      const asciiRank = 8 - coordinates.rank + 1 // Convert to ASCII line number
      const asciiFile = coordinates.file * 3 + 2 // Convert to ASCII column position
      
      // This is a simplified approach - in practice you might want more sophisticated highlighting
      result += `\nHighlighted: ${square} at line ${asciiRank}, col ${asciiFile}`
    })
    
    return result
  }

  /**
   * Debug helper: Print all pieces with their positions
   */
  debugPieces(): string {
    const pieces = this.board.getPieces()
    let result = 'Pieces on board:\n'
    
    pieces.forEach(piece => {
      result += `  ${piece.color} ${piece.type} on ${piece.square}\n`
    })
    
    return result
  }

  /**
   * Debug helper: Print attack information for a square
   */
  debugAttacks(square: Square): string {
    const whiteAttackers = this.board.getAttackers(square, 'white')
    const blackAttackers = this.board.getAttackers(square, 'black')
    
    let result = `Attack information for ${square}:\n`
    result += `  Attacked by white: ${whiteAttackers.length > 0 ? whiteAttackers.join(', ') : 'none'}\n`
    result += `  Attacked by black: ${blackAttackers.length > 0 ? blackAttackers.join(', ') : 'none'}\n`
    
    return result
  }

  /**
   * Debug helper: Print move generation information
   */
  debugMoveGeneration(): string {
    const moves = this.board.getMoves()
    const allMoves = this.board.getAllMoves()
    
    let result = 'Move generation:\n'
    result += `  Legal moves: ${moves.length}\n`
    result += `  All moves (both colors): ${allMoves.length}\n`
    result += `  Current turn: ${this.board.getTurn()}\n`
    
    return result
  }

  /**
   * Debug helper: Print position information
   */
  debugPosition(): string {
    let result = 'Position information:\n'
    result += `  FEN: ${this.board.getFen()}\n`
    result += `  Valid: ${this.board.isValid()}\n`
    result += `  Turn: ${this.board.getTurn()}\n`
    
    return result
  }
}

