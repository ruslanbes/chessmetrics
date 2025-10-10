import { Chess } from 'chess.js'
import { Color, Piece, Move, PieceType, Square, SquareUtils } from '../../types/chess'

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
   * Check if a piece on a given square can attack a target square
   * Logic: imagine there's an enemy pawn on the target square and it's the attacking player's turn
   */
  canAttack(fromSquare: Square, toSquare: Square, attackingColor: Color): boolean {
    const currentFen = this.chess.fen()
    const enemyColor = attackingColor === 'white' ? 'black' : 'white'
    const attackingTurn = attackingColor === 'white' ? 'w' : 'b'
    
    try {
      // Create a temporary chess instance
      const fenParts = currentFen.split(' ')
      fenParts[1] = attackingTurn // Set turn to attacking player
      fenParts[3] = '-' // Clear en-passant square to avoid illegal positions
      const tempFen = fenParts.join(' ')
      const tempChess = new (this.chess.constructor as any)(tempFen)
      
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
    const piece = this.chess.get(fromSquare)
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
   * Get ASCII representation of the board (delegates to chess.js)
   */
  getAscii(): string {
    return this.chess.ascii()
  }

  /**
   * Get 2D array representation of the board (delegates to chess.js)
   */
  getBoardArray(): any[][] {
    return this.chess.board()
  }

  /**
   * Get all pieces attacking a specific square
   */
  getAttackers(square: Square, color: Color): Square[] {
    const chessColor = color === 'white' ? 'w' : 'b'
    return this.chess.attackers(square, chessColor)
  }

  /**
   * Check if a square is attacked by a specific color
   */
  isAttacked(square: Square, color: Color): boolean {
    const chessColor = color === 'white' ? 'w' : 'b'
    return this.chess.isAttacked(square, chessColor)
  }

  /**
   * Get all squares on a line between two squares (useful for pin detection)
   */
  getSquaresBetween(fromSquare: Square, toSquare: Square): Square[] {
    return SquareUtils.getSquaresBetween(fromSquare, toSquare)
  }

  /**
   * Check if three squares are on the same line (rank, file, or diagonal)
   */
  areOnSameLine(square1: Square, square2: Square, square3: Square): boolean {
    return SquareUtils.areOnSameLine(square1, square2, square3)
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
   * Debug helper: Print board with highlighted squares
   */
  debugBoard(highlightSquares: Square[] = []): string {
    const ascii = this.getAscii()
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
    const pieces = this.getPieces()
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
    const whiteAttackers = this.getAttackers(square, 'white')
    const blackAttackers = this.getAttackers(square, 'black')
    
    let result = `Attack information for ${square}:\n`
    result += `  Attacked by white: ${whiteAttackers.length > 0 ? whiteAttackers.join(', ') : 'none'}\n`
    result += `  Attacked by black: ${blackAttackers.length > 0 ? blackAttackers.join(', ') : 'none'}\n`
    
    return result
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
