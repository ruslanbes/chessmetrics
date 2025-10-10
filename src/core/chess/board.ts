import { Chess } from 'chess.js'
import { Color, Piece, Move, PieceType, Square, SquareUtils } from '../../types/chess'
import { AttackAnalyzer } from './AttackAnalyzer'
import { BoardDebugger } from './BoardDebugger'
import { GeometricAnalyzer } from './GeometricAnalyzer'

export class ChessBoard {
  public chess: Chess
  private attackAnalyzer: AttackAnalyzer
  private geometricAnalyzer: GeometricAnalyzer
  private debugger: BoardDebugger

  constructor(fen: string) {
    this.chess = new Chess(fen)
    this.attackAnalyzer = new AttackAnalyzer(this)
    this.geometricAnalyzer = new GeometricAnalyzer()
    this.debugger = new BoardDebugger(this)
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
    return this.attackAnalyzer.canAttack(fromSquare, toSquare, attackingColor)
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
    return this.attackAnalyzer.getAttackers(square, color)
  }

  /**
   * Check if a square is attacked by a specific color
   */
  isAttacked(square: Square, color: Color): boolean {
    return this.attackAnalyzer.isAttacked(square, color)
  }

  /**
   * Get all squares on a line between two squares (useful for pin detection)
   */
  getSquaresBetween(fromSquare: Square, toSquare: Square): Square[] {
    return this.geometricAnalyzer.getSquaresBetween(fromSquare, toSquare)
  }

  /**
   * Check if three squares are on the same line (rank, file, or diagonal)
   */
  areOnSameLine(square1: Square, square2: Square, square3: Square): boolean {
    return this.geometricAnalyzer.areOnSameLine(square1, square2, square3)
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
    return this.debugger.debugBoard(highlightSquares)
  }

  /**
   * Debug helper: Print all pieces with their positions
   */
  debugPieces(): string {
    return this.debugger.debugPieces()
  }

  /**
   * Debug helper: Print attack information for a square
   */
  debugAttacks(square: Square): string {
    return this.debugger.debugAttacks(square)
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
