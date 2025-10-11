import { Chess } from 'chess.js'
import { Color, Square, SquareUtils } from '../../types/chess'

interface BoardInterface {
  getFen(): string
  chess: Chess
}

export class AttackAnalyzer {
  constructor(private board: BoardInterface) {}

  /**
   * Check if a piece on a given square can attack a target square
   * Logic: imagine there's an enemy pawn on the target square and it's the attacking player's turn
   */
  canAttack(fromSquare: Square, toSquare: Square, attackingColor: Color): boolean {
    const currentFen = this.board.getFen()
    const enemyColor = attackingColor === 'white' ? 'black' : 'white'
    const attackingTurn = attackingColor === 'white' ? 'w' : 'b'
    
    try {
      // Create a temporary chess instance
      const fenParts = currentFen.split(' ')
      fenParts[1] = attackingTurn // Set turn to attacking player
      fenParts[3] = '-' // Clear en-passant square to avoid illegal positions.
      const tempFen = fenParts.join(' ')
      const tempChess = new (this.board['chess'].constructor as any)(tempFen)
      
      // Place an enemy pawn on the target square (regardless of what's currently there)
      tempChess.put({ type: 'p', color: enemyColor === 'white' ? 'w' : 'b' }, toSquare)
      
      // Check if the attacking piece can move to the target square
      const moves = tempChess.moves({ square: fromSquare, verbose: true })
      return moves.some((move: any) => move.to === toSquare)
    } catch (error) {
      // If we can't create the temporary position, fall back to basic attack detection
      return this.basicAttackDetection(fromSquare, toSquare, attackingColor)
    }
  }

  /**
   * Basic attack detection for common piece patterns
   */
  private basicAttackDetection(fromSquare: Square, toSquare: Square, attackingColor: Color): boolean {
    const fromCoords = SquareUtils.toCoordinates(fromSquare)
    const toCoords = SquareUtils.toCoordinates(toSquare)

    const fileDiff = Math.abs(toCoords.file - fromCoords.file)
    const rankDiff = Math.abs(toCoords.rank - fromCoords.rank)

    // Get the piece on the from square
    const piece = this.board['chess'].get(fromSquare)
    if (!piece) return false

    // Check if it's the right color
    const pieceColor = piece.color === 'w' ? 'white' : 'black'
    if (pieceColor !== attackingColor) return false

    // Basic attack patterns
    switch (piece.type) {
      case 'p': // Pawn
        const direction = attackingColor === 'white' ? 1 : -1
        return fileDiff === 1 && (toCoords.rank - fromCoords.rank) === direction
      
      case 'r': // Rook
        return (fileDiff === 0 && rankDiff > 0) || (rankDiff === 0 && fileDiff > 0)
      
      case 'b': // Bishop
        return fileDiff === rankDiff && fileDiff > 0
      
      case 'q': // Queen
        return (fileDiff === 0 && rankDiff > 0) || (rankDiff === 0 && fileDiff > 0) || (fileDiff === rankDiff && fileDiff > 0)
      
      case 'k': // King
        return fileDiff <= 1 && rankDiff <= 1 && (fileDiff > 0 || rankDiff > 0)
      
      case 'n': // Knight
        return (fileDiff === 2 && rankDiff === 1) || (fileDiff === 1 && rankDiff === 2)
      
      default:
        return false
    }
  }

  /**
   * Get all pieces attacking a specific square
   */
  getAttackers(square: Square, color: Color): Square[] {
    const chessColor = color === 'white' ? 'w' : 'b'
    return this.board['chess'].attackers(square, chessColor)
  }

  /**
   * Check if a square is attacked by a specific color
   */
  isAttacked(square: Square, color: Color): boolean {
    const chessColor = color === 'white' ? 'w' : 'b'
    return this.board['chess'].isAttacked(square, chessColor)
  }
}

