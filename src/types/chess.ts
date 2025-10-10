// Basic chess types
export type Color = 'white' | 'black'
export type PieceType = 'pawn' | 'rook' | 'bishop' | 'knight' | 'queen' | 'king'
export type SquareColor = 'light' | 'dark'

// Chess square type (all valid square names on a chess board)
export type Square =
  | 'a8' | 'b8' | 'c8' | 'd8' | 'e8' | 'f8' | 'g8' | 'h8'
  | 'a7' | 'b7' | 'c7' | 'd7' | 'e7' | 'f7' | 'g7' | 'h7'
  | 'a6' | 'b6' | 'c6' | 'd6' | 'e6' | 'f6' | 'g6' | 'h6'
  | 'a5' | 'b5' | 'c5' | 'd5' | 'e5' | 'f5' | 'g5' | 'h5'
  | 'a4' | 'b4' | 'c4' | 'd4' | 'e4' | 'f4' | 'g4' | 'h4'
  | 'a3' | 'b3' | 'c3' | 'd3' | 'e3' | 'f3' | 'g3' | 'h3'
  | 'a2' | 'b2' | 'c2' | 'd2' | 'e2' | 'f2' | 'g2' | 'h2'
  | 'a1' | 'b1' | 'c1' | 'd1' | 'e1' | 'f1' | 'g1' | 'h1'

// Square coordinates (0-indexed from top-left)
export interface SquareCoordinates {
  file: number // 0-7 (a-h)
  rank: number // 0-7 (8-1, top to bottom)
}

// Piece representation
export interface Piece {
  type: PieceType
  color: Color
  square: Square
  file: number // 0-7 (a-h)
  rank: number // 0-7 (8-1, top to bottom)
}

// Move representation
export interface Move {
  from: Square
  to: Square
  piece: PieceType
  color: Color
  promotion?: PieceType | undefined
  san?: string | undefined
  lan?: string | undefined
}

// Utility functions for coordinate conversion
export class SquareUtils {
  /**
   * Convert square notation to coordinates (0-indexed from top-left)
   */
  static toCoordinates(square: Square): SquareCoordinates {
    return {
      file: square.charCodeAt(0) - 97, // a=0, b=1, etc.
      rank: 8 - parseInt(square[1]!)   // 8=0, 7=1, etc. (top to bottom)
    }
  }

  /**
   * Convert coordinates to square notation
   */
  static fromCoordinates(file: number, rank: number): Square {
    const fileChar = String.fromCharCode(97 + file) // 0=a, 1=b, etc.
    const rankNum = 8 - rank // 0=8, 1=7, etc.
    return `${fileChar}${rankNum}` as Square
  }

  /**
   * Get file from square (0-7, a-h)
   */
  static getFile(square: Square): number {
    return square.charCodeAt(0) - 97
  }

  /**
   * Get rank from square (0-7, 8-1, top to bottom)
   */
  static getRank(square: Square): number {
    return 8 - parseInt(square[1]!)
  }

  /**
   * Check if three squares are on the same line (rank, file, or diagonal)
   */
  static areOnSameLine(square1: Square, square2: Square, square3: Square): boolean {
    const coords1 = this.toCoordinates(square1)
    const coords2 = this.toCoordinates(square2)
    const coords3 = this.toCoordinates(square3)
    
    // Same rank
    if (coords1.rank === coords2.rank && coords2.rank === coords3.rank) {
      return true
    }
    
    // Same file
    if (coords1.file === coords2.file && coords2.file === coords3.file) {
      return true
    }
    
    // Same diagonal
    if (Math.abs(coords1.rank - coords2.rank) === Math.abs(coords1.file - coords2.file) &&
        Math.abs(coords2.rank - coords3.rank) === Math.abs(coords2.file - coords3.file) &&
        Math.abs(coords1.rank - coords3.rank) === Math.abs(coords1.file - coords3.file)) {
      return true
    }
    
    return false
  }

  /**
   * Get all squares on a line between two squares
   */
  static getSquaresBetween(fromSquare: Square, toSquare: Square): Square[] {
    const from = this.toCoordinates(fromSquare)
    const to = this.toCoordinates(toSquare)
    const squares: Square[] = []
    
    // Determine the direction
    const fileStep = to.file > from.file ? 1 : to.file < from.file ? -1 : 0
    const rankStep = to.rank > from.rank ? 1 : to.rank < from.rank ? -1 : 0
    
    // Check if squares are aligned (same rank, file, or diagonal)
    const isAligned = fileStep === 0 || rankStep === 0 || Math.abs(fileStep) === Math.abs(rankStep)
    if (!isAligned) {
      return squares // Not aligned, no squares between
    }
    
    // Get squares between (excluding endpoints)
    let file = from.file + fileStep
    let rank = from.rank + rankStep
    
    while (file !== to.file || rank !== to.rank) {
      if (file >= 0 && file < 8 && rank >= 0 && rank < 8) {
        squares.push(this.fromCoordinates(file, rank))
      }
      file += fileStep
      rank += rankStep
    }
    
    return squares
  }
}
