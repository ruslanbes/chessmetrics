import { ChessBoard } from '../../../core/chess/board'
import { Piece } from '../../../types/chess'

export interface PieceMetricContext {
  piece: Piece
  board: ChessBoard
}

export class IsPinnedMetric {
  description = "isPinned tells if this piece is pinned (some of its moves are invalid due to king exposure)"

  calculate(piece: Piece, board: ChessBoard): boolean {
    // Get the piece's king
    const pieces = board.getPieces()
    const king = pieces.find(p => p.color === piece.color && p.type === 'king')
    
    if (!king) {
      return false
    }
    
    // Check if the piece is on the same rank, file, or diagonal as the king
    const pieceFile = piece.square.charCodeAt(0) - 97 // a=0, b=1, etc.
    const pieceRank = parseInt(piece.square[1]!) - 1 // 1=0, 2=1, etc.
    const kingFile = king.square.charCodeAt(0) - 97
    const kingRank = parseInt(king.square[1]!) - 1
    
    // Check if piece and king are aligned (same rank, file, or diagonal)
    const sameRank = pieceRank === kingRank
    const sameFile = pieceFile === kingFile
    const sameDiagonal = Math.abs(pieceRank - kingRank) === Math.abs(pieceFile - kingFile)
    
    if (!sameRank && !sameFile && !sameDiagonal) {
      return false // Piece is not aligned with king, so it can't be pinned
    }
    
    // Check if there's an enemy piece that could attack the king through this piece
    const enemyPieces = pieces.filter(p => p.color !== piece.color)
    
    for (const enemyPiece of enemyPieces) {
      if (this.canAttackThroughPiece(enemyPiece, piece, king, board)) {
        return true
      }
    }
    
    return false
  }
  
  private canAttackThroughPiece(enemyPiece: Piece, pinnedPiece: Piece, king: Piece, board: ChessBoard): boolean {
    // Check if enemy piece is aligned with both the pinned piece and the king
    const enemyToPinned = this.areAligned(enemyPiece.square, pinnedPiece.square)
    const pinnedToKing = this.areAligned(pinnedPiece.square, king.square)
    const enemyToKing = this.areAligned(enemyPiece.square, king.square)
    
    if (!enemyToPinned || !pinnedToKing || !enemyToKing) {
      return false
    }
    
    // Check if the enemy piece type can attack through the pinned piece
    const canAttackThrough = this.canPieceTypeAttackThrough(enemyPiece.type, enemyPiece.square, pinnedPiece.square, king.square)
    
    if (!canAttackThrough) {
      return false
    }
    
    // Check if there are no pieces between the enemy and the pinned piece
    const pathClear = this.isPathClear(enemyPiece.square, pinnedPiece.square, board)
    
    return pathClear
  }
  
  private areAligned(square1: string, square2: string): boolean {
    const file1 = square1.charCodeAt(0) - 97
    const rank1 = parseInt(square1[1]!) - 1
    const file2 = square2.charCodeAt(0) - 97
    const rank2 = parseInt(square2[1]!) - 1
    
    return file1 === file2 || rank1 === rank2 || Math.abs(rank1 - rank2) === Math.abs(file1 - file2)
  }
  
  private canPieceTypeAttackThrough(pieceType: string, from: string, through: string, to: string): boolean {
    // Check if the piece type can attack through the intermediate square
    switch (pieceType) {
      case 'rook':
        // Rooks can attack through if all squares are on same rank or file
        return this.areAligned(from, through) && this.areAligned(through, to)
      case 'bishop':
        // Bishops can attack through if all squares are on same diagonal
        return this.areAligned(from, through) && this.areAligned(through, to)
      case 'queen':
        // Queens can attack through if all squares are aligned
        return this.areAligned(from, through) && this.areAligned(through, to)
      default:
        return false // Other pieces can't attack through
    }
  }
  
  private isPathClear(from: string, to: string, board: ChessBoard): boolean {
    const fromFile = from.charCodeAt(0) - 97
    const fromRank = parseInt(from[1]!) - 1
    const toFile = to.charCodeAt(0) - 97
    const toRank = parseInt(to[1]!) - 1
    
    const fileStep = toFile === fromFile ? 0 : (toFile > fromFile ? 1 : -1)
    const rankStep = toRank === fromRank ? 0 : (toRank > fromRank ? 1 : -1)
    
    let currentFile = fromFile + fileStep
    let currentRank = fromRank + rankStep
    
    while (currentFile !== toFile || currentRank !== toRank) {
      const square = String.fromCharCode(97 + currentFile) + (currentRank + 1)
      if (board.getPieces().some(p => p.square === square)) {
        return false // Path is blocked
      }
      currentFile += fileStep
      currentRank += rankStep
    }
    
    return true // Path is clear
  }
}
