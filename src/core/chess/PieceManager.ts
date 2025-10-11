import { Chess } from 'chess.js'
import { Piece, PieceType, Square, SquareUtils } from '../../types/chess'

export class PieceManager {
  constructor(private chess: Chess) {}

  /**
   * Get all pieces on the board
   */
  getPieces(): Piece[] {
    const pieces: Piece[] = []
    const board = this.chess.board()

    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const square = board[rank]?.[file]
        if (square) {
          const squareName = this.getSquareName(rank, file)
          const coordinates = SquareUtils.toCoordinates(squareName)
          pieces.push({
            type: this.mapPieceType(square.type),
            color: square.color === 'w' ? 'white' : 'black',
            square: squareName,
            file: coordinates.file,
            rank: coordinates.rank
          })
        }
      }
    }

    return pieces
  }

  /**
   * Get piece at a specific square (delegates to chess.js)
   */
  getPieceAt(square: Square): Piece | null {
    const piece = this.chess.get(square)
    if (!piece) return null
    
    const coordinates = SquareUtils.toCoordinates(square)
    return {
      type: this.mapPieceType(piece.type),
      color: piece.color === 'w' ? 'white' : 'black',
      square: square,
      file: coordinates.file,
      rank: coordinates.rank
    }
  }

  /**
   * Convert rank/file to square name (e.g., 0,0 -> "a8")
   */
  private getSquareName(rank: number, file: number): Square {
    const fileChar = String.fromCharCode(97 + file) // 'a' to 'h'
    const rankNum = 8 - rank // 8 to 1
    return `${fileChar}${rankNum}` as Square
  }

  /**
   * Map chess.js piece type to our PieceType
   */
  private mapPieceType(chessType: string): PieceType {
    const typeMap: Record<string, PieceType> = {
      'p': 'pawn',
      'r': 'rook',
      'n': 'knight',
      'b': 'bishop',
      'q': 'queen',
      'k': 'king'
    }
    return typeMap[chessType] || 'pawn' // fallback to pawn
  }
}
