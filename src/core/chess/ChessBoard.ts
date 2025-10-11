import { Chess } from 'chess.js'
import { Color, Piece, Move, Square } from '../../types/chess'
import { AttackAnalyzer } from './AttackAnalyzer'
import { BoardDebugger } from './BoardDebugger'
import { GeometricAnalyzer } from './GeometricAnalyzer'
import { BoardStateManager } from './BoardStateManager'
import { PieceManager } from './PieceManager'
import { MoveManager } from './MoveManager'

export class ChessBoard {
  public chess: Chess
  private stateManager: BoardStateManager
  private pieceManager: PieceManager
  private moveManager: MoveManager
  private attackAnalyzer: AttackAnalyzer
  private geometricAnalyzer: GeometricAnalyzer
  private debugger: BoardDebugger

  constructor(fen: string) {
    this.chess = new Chess(fen)
    this.stateManager = new BoardStateManager(this.chess)
    this.pieceManager = new PieceManager(this.chess)
    this.moveManager = new MoveManager(this.chess)
    this.attackAnalyzer = new AttackAnalyzer(this)
    this.geometricAnalyzer = new GeometricAnalyzer()
    this.debugger = new BoardDebugger(this)
  }

  /**
   * Get the current turn (whose move it is)
   */
  getTurn(): Color {
    return this.stateManager.getTurn()
  }

  /**
   * Get the current FEN string
   */
  getFen(): string {
    return this.stateManager.getFen()
  }

  /**
   * Get all pieces on the board
   */
  getPieces(): Piece[] {
    return this.pieceManager.getPieces()
  }

  /**
   * Get all legal moves
   */
  getMoves(): Move[] {
    return this.moveManager.getMoves()
  }

  /**
   * Get all possible moves for both colors (for attack analysis)
   */
  getAllMoves(): Move[] {
    return this.moveManager.getAllMoves()
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
    return this.stateManager.isValid()
  }

  /**
   * Get ASCII representation of the board (delegates to chess.js)
   */
  getAscii(): string {
    return this.stateManager.getAscii()
  }

  /**
   * Get 2D array representation of the board (delegates to chess.js)
   */
  getBoardArray(): any[][] {
    return this.stateManager.getBoardArray()
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
    return this.pieceManager.getPieceAt(square)
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

}
