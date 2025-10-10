import { ChessBoard } from '../../../core/chess/board'
import { Piece } from '../../../types/chess'

export interface PieceMetricContext {
  piece: Piece
  board: ChessBoard
}

export class IsPinnedMetric {
  description = "isPinned tells if this piece is pinned (some of its moves are invalid due to king exposure)"

  calculate(piece: Piece, board: ChessBoard): boolean {
    // Get all legal moves for this piece's color
    const allMoves = board.getAllMoves()
    const pieceMoves = allMoves.filter(move => 
      move.from === piece.square && move.color === piece.color
    )
    
    // If the piece has no moves, it's not pinned (it's just blocked)
    if (pieceMoves.length === 0) {
      return false
    }
    
    // A piece is pinned if it has significantly fewer legal moves than it should have
    // Chess.js automatically prevents moves that would expose the king to check
    // We can detect pins by comparing actual moves with theoretical moves
    
    // Get the piece's theoretical maximum moves based on its type and position
    const theoreticalMoves = this.getTheoreticalMoves(piece)
    
    // Calculate the ratio of actual moves to theoretical moves
    const moveRatio = pieceMoves.length / theoreticalMoves.length
    
    // A piece is likely pinned if:
    // 1. It has significantly fewer moves than theoretically possible (less than 50% of theoretical moves)
    // 2. It's aligned with its king
    if (moveRatio < 0.5 && this.isAlignedWithKing(piece, board)) {
      return true
    }
    
    return false
  }
  
  private getTheoreticalMoves(piece: Piece): string[] {
    // Get all possible squares this piece could theoretically move to
    switch (piece.type) {
      case 'rook':
        return this.getRookTheoreticalMoves(piece.square)
      case 'bishop':
        return this.getBishopTheoreticalMoves(piece.square)
      case 'queen':
        return [...this.getRookTheoreticalMoves(piece.square), 
                ...this.getBishopTheoreticalMoves(piece.square)]
      default:
        // For other pieces, we'll use a simpler approach
        return []
    }
  }
  
  private getRookTheoreticalMoves(square: string): string[] {
    const moves: string[] = []
    const file = square.charCodeAt(0) - 97
    const rank = parseInt(square[1]!) - 1
    
    // Add all squares on the same rank
    for (let f = 0; f < 8; f++) {
      if (f !== file) {
        moves.push(String.fromCharCode(97 + f) + (rank + 1))
      }
    }
    
    // Add all squares on the same file
    for (let r = 0; r < 8; r++) {
      if (r !== rank) {
        moves.push(String.fromCharCode(97 + file) + (r + 1))
      }
    }
    
    return moves
  }
  
  private getBishopTheoreticalMoves(square: string): string[] {
    const moves: string[] = []
    const file = square.charCodeAt(0) - 97
    const rank = parseInt(square[1]!) - 1
    
    // Add all squares on the diagonals
    for (let i = 1; i < 8; i++) {
      // Diagonal 1: +i, +i
      if (file + i < 8 && rank + i < 8) {
        moves.push(String.fromCharCode(97 + file + i) + (rank + i + 1))
      }
      // Diagonal 2: +i, -i
      if (file + i < 8 && rank - i >= 0) {
        moves.push(String.fromCharCode(97 + file + i) + (rank - i + 1))
      }
      // Diagonal 3: -i, +i
      if (file - i >= 0 && rank + i < 8) {
        moves.push(String.fromCharCode(97 + file - i) + (rank + i + 1))
      }
      // Diagonal 4: -i, -i
      if (file - i >= 0 && rank - i >= 0) {
        moves.push(String.fromCharCode(97 + file - i) + (rank - i + 1))
      }
    }
    
    return moves
  }
  
  private isAlignedWithKing(piece: Piece, board: ChessBoard): boolean {
    // Check if the piece is aligned with its king
    const pieces = board.getPieces()
    const king = pieces.find(p => p.color === piece.color && p.type === 'king')
    
    if (!king) {
      return false
    }
    
    // Check if piece and king are aligned (same rank, file, or diagonal)
    const pieceFile = piece.square.charCodeAt(0) - 97
    const pieceRank = parseInt(piece.square[1]!) - 1
    const kingFile = king.square.charCodeAt(0) - 97
    const kingRank = parseInt(king.square[1]!) - 1
    
    const sameRank = pieceRank === kingRank
    const sameFile = pieceFile === kingFile
    const sameDiagonal = Math.abs(pieceRank - kingRank) === Math.abs(pieceFile - kingFile)
    
    // If the piece is aligned with its king and has fewer moves than expected,
    // it's likely pinned
    return sameRank || sameFile || sameDiagonal
  }
}
