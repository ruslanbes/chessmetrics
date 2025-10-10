import { Chess } from 'chess.js'
import { Color, Piece, Move, PieceType, Square } from '../../types/chess'

export class ChessBoard {
  private chess: Chess

  constructor(fen: string) {
    this.chess = new Chess(fen)
  }

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
   * Get all pieces on the board
   */
  getPieces(): Piece[] {
    const pieces: Piece[] = []
    const board = this.chess.board()

    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const square = board[rank]?.[file]
        if (square) {
          pieces.push({
            type: this.mapPieceType(square.type),
            color: square.color === 'w' ? 'white' : 'black',
            square: this.getSquareName(rank, file)
          })
        }
      }
    }

    return pieces
  }

  /**
   * Get all legal moves
   */
  getMoves(): Move[] {
    return this.chess.moves({ verbose: true }).map(move => ({
      from: move.from,
      to: move.to,
      piece: this.mapPieceType(move.piece),
      color: move.color === 'w' ? 'white' : 'black',
      promotion: move.promotion ? this.mapPieceType(move.promotion) : undefined,
      san: move.san,
      lan: move.lan
    }))
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
