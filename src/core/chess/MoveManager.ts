import { Chess } from 'chess.js'
import { Move, PieceType } from '../../types/chess'

export class MoveManager {
  constructor(private chess: Chess) {}

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
   * Get all possible moves for both colors (for attack analysis)
   */
  getAllMoves(): Move[] {
    const currentFen = this.chess.fen()
    const allMoves: Move[] = []

    // Get moves for current turn
    allMoves.push(...this.getMoves())

    // Get moves for opposite turn by temporarily switching
    const oppositeTurn = this.chess.turn() === 'w' ? 'b' : 'w'
    const fenParts = currentFen.split(' ')
    fenParts[1] = oppositeTurn // Change the turn indicator
    const oppositeFen = fenParts.join(' ')
    
    try {
      const oppositeChess = new (this.chess.constructor as any)(oppositeFen)
      const oppositeMoves = oppositeChess.moves({ verbose: true }).map((move: any) => ({
        from: move.from,
        to: move.to,
        piece: this.mapPieceType(move.piece),
        color: move.color === 'w' ? 'white' : 'black',
        promotion: move.promotion ? this.mapPieceType(move.promotion) : undefined,
        san: move.san,
        lan: move.lan
      }))
      allMoves.push(...oppositeMoves)
    } catch (error) {
      // If switching turns fails, just return current moves
      console.warn('Failed to get moves for opposite turn:', error)
    }

    return allMoves
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
