import { ChessBoard } from '../../../core/chess/board'
import { Piece } from '../../../types/chess'

export interface PieceMetricContext {
  piece: Piece
  board: ChessBoard
}

export class IsPinnedMetric {
  description = "isPinned tells if this piece is pinned (some of its moves are invalid due to king exposure)"
  private board!: ChessBoard

  calculate(piece: Piece, board: ChessBoard): boolean {
    this.board = board
    // A piece is pinned if moving it would expose the king to check
    // We can detect this by temporarily moving the piece and checking if the king is in check
    
    // Kings can never be pinned - if a king is under attack, it's in check, not pinned
    if (piece.type === 'king') {
      return false
    }
    
    const king = board.getPieces().find(p => p.color === piece.color && p.type === 'king')
    if (!king) {
      return false
    }
    
    // Note: A piece can be pinned even if it has no legal moves
    // (e.g., a pawn blocked by another piece but still pinned)
    
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
          // Check if there are any pieces blocking the line between the attacking piece and the king
          // Exclude the piece being checked for pinning from the blocking check
          if (!this.hasBlockingPieces(enemyPiece.square, king.square, board, piece.square)) {
            return enemyPiece
          }
        }
      }
    }
    
    return null
  }

  /**
   * Check if three squares are on the same line (rank, file, or diagonal)
   */
  private isOnSameLine(square1: string, square2: string, square3: string): boolean {
    // Use the ChessBoard helper method
    return this.board.areOnSameLine(square1 as any, square2 as any, square3 as any)
  }


  /**
   * Check if there are any pieces blocking the line between two squares
   */
  private hasBlockingPieces(fromSquare: string, toSquare: string, board: ChessBoard, excludeSquare?: string): boolean {
    // Use the ChessBoard helper method to get squares between
    const squaresBetween = board.getSquaresBetween(fromSquare as any, toSquare as any)
    
    // Check each square for blocking pieces
    for (const square of squaresBetween) {
      // Skip the excluded square (e.g., the piece being checked for pinning)
      if (excludeSquare && square === excludeSquare) {
        continue
      }
      
      const piece = board.getPieces().find(p => p.square === square)
      if (piece) {
        // Any piece blocks the attack - the color doesn't matter for blocking
        return true // Found a blocking piece
      }
    }
    
    return false // No blocking pieces found
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


