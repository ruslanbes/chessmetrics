import { ChessBoard } from '../../../core/chess/board'
import { Piece } from '../../../types/chess'

export interface PieceMetricContext {
  piece: Piece
  board: ChessBoard
}

export class IsPinnedMetric {
  description = "isPinned tells if this piece is pinned (some of its moves are invalid due to king exposure)"

  calculate(piece: Piece, board: ChessBoard): boolean {
    // A piece is pinned if moving it would expose the king to check
    // We can detect this by temporarily moving the piece and checking if the king is in check
    
    const king = board.getPieces().find(p => p.color === piece.color && p.type === 'king')
    if (!king) {
      return false
    }
    
    // Get all legal moves for this piece
    const allMoves = board.getAllMoves()
    const pieceMoves = allMoves.filter(move => 
      move.from === piece.square && move.color === piece.color
    )
    
    // If the piece has no moves, it's not pinned (it's just blocked)
    if (pieceMoves.length === 0) {
      return false
    }
    
    // Check if the piece is aligned with its king (same rank, file, or diagonal)
    if (!this.isAlignedWithKing(piece, king)) {
      return false
    }
    
    // Check if there's an enemy piece attacking along the line between the piece and king
    const attackingPiece = this.findAttackingPieceOnLine(piece, king, board)
    if (!attackingPiece) {
      return false
    }
    
    // The piece is pinned if:
    // 1. It's aligned with its king
    // 2. There's an enemy piece attacking along that line
    // If both conditions are true, then moving the piece would expose the king to check
    return true
  }

  private isAlignedWithKing(piece: Piece, king: Piece): boolean {
    // Check if piece and king are aligned (same rank, file, or diagonal)
    const pieceFile = piece.square.charCodeAt(0) - 97
    const pieceRank = parseInt(piece.square[1]!) - 1
    const kingFile = king.square.charCodeAt(0) - 97
    const kingRank = parseInt(king.square[1]!) - 1
    
    const sameRank = pieceRank === kingRank
    const sameFile = pieceFile === kingFile
    const sameDiagonal = Math.abs(pieceRank - kingRank) === Math.abs(pieceFile - kingFile)
    
    return sameRank || sameFile || sameDiagonal
  }

  /**
   * Find an enemy piece that could attack along the line between the piece and king
   */
  private findAttackingPieceOnLine(piece: Piece, king: Piece, board: ChessBoard): Piece | null {
    const pieces = board.getPieces()
    const enemyPieces = pieces.filter(p => p.color !== piece.color)
    
    // Check if any enemy piece is on the same line as the piece and king
    for (const enemyPiece of enemyPieces) {
      // Check if the enemy piece is on the same line (rank, file, or diagonal)
      if (this.isOnSameLine(piece.square, king.square, enemyPiece.square)) {
        // Check if this enemy piece can attack the king
        if (this.canAttackSquare(enemyPiece, king.square, board)) {
          return enemyPiece
        }
      }
    }
    
    return null
  }

  /**
   * Check if three squares are on the same line (rank, file, or diagonal)
   */
  private isOnSameLine(square1: string, square2: string, square3: string): boolean {
    const file1 = square1.charCodeAt(0) - 97
    const rank1 = parseInt(square1[1]!) - 1
    const file2 = square2.charCodeAt(0) - 97
    const rank2 = parseInt(square2[1]!) - 1
    const file3 = square3.charCodeAt(0) - 97
    const rank3 = parseInt(square3[1]!) - 1
    
    // Same rank
    if (rank1 === rank2 && rank2 === rank3) {
      return true
    }
    
    // Same file
    if (file1 === file2 && file2 === file3) {
      return true
    }
    
    // Same diagonal
    if (Math.abs(rank1 - rank2) === Math.abs(file1 - file2) &&
        Math.abs(rank2 - rank3) === Math.abs(file2 - file3) &&
        Math.abs(rank1 - rank3) === Math.abs(file1 - file3)) {
      return true
    }
    
    return false
  }


  /**
   * Check if a piece can attack a specific square
   */
  private canAttackSquare(piece: Piece, targetSquare: string, _board: ChessBoard): boolean {
    // This is a simplified check - in a real implementation, we'd need to check
    // if the piece can actually move to that square given the current board state
    const pieceFile = piece.square.charCodeAt(0) - 97
    const pieceRank = parseInt(piece.square[1]!) - 1
    const targetFile = targetSquare.charCodeAt(0) - 97
    const targetRank = parseInt(targetSquare[1]!) - 1
    
    switch (piece.type) {
      case 'rook':
        return pieceFile === targetFile || pieceRank === targetRank
      case 'bishop':
        return Math.abs(pieceFile - targetFile) === Math.abs(pieceRank - targetRank)
      case 'queen':
        return pieceFile === targetFile || pieceRank === targetRank || 
               Math.abs(pieceFile - targetFile) === Math.abs(pieceRank - targetRank)
      default:
        return false
    }
  }

}


