import { Square, SquareUtils } from '../../types/chess'

export class GeometricAnalyzer {
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
   * Calculate the distance between two squares
   */
  getDistance(square1: Square, square2: Square): number {
    const coords1 = SquareUtils.toCoordinates(square1)
    const coords2 = SquareUtils.toCoordinates(square2)
    
    const fileDiff = Math.abs(coords2.file - coords1.file)
    const rankDiff = Math.abs(coords2.rank - coords1.rank)
    
    // Return the maximum of file and rank difference (Chebyshev distance)
    return Math.max(fileDiff, rankDiff)
  }

  /**
   * Get the direction vector between two squares
   */
  getDirection(fromSquare: Square, toSquare: Square): { file: number, rank: number } {
    const fromCoords = SquareUtils.toCoordinates(fromSquare)
    const toCoords = SquareUtils.toCoordinates(toSquare)
    
    const fileDiff = toCoords.file - fromCoords.file
    const rankDiff = toCoords.rank - fromCoords.rank
    
    // Normalize to -1, 0, or 1
    return {
      file: fileDiff === 0 ? 0 : fileDiff > 0 ? 1 : -1,
      rank: rankDiff === 0 ? 0 : rankDiff > 0 ? 1 : -1
    }
  }

  /**
   * Check if two squares are on the same rank
   */
  isOnSameRank(square1: Square, square2: Square): boolean {
    const coords1 = SquareUtils.toCoordinates(square1)
    const coords2 = SquareUtils.toCoordinates(square2)
    return coords1.rank === coords2.rank
  }

  /**
   * Check if two squares are on the same file
   */
  isOnSameFile(square1: Square, square2: Square): boolean {
    const coords1 = SquareUtils.toCoordinates(square1)
    const coords2 = SquareUtils.toCoordinates(square2)
    return coords1.file === coords2.file
  }

  /**
   * Check if two squares are on the same diagonal
   */
  isOnSameDiagonal(square1: Square, square2: Square): boolean {
    const coords1 = SquareUtils.toCoordinates(square1)
    const coords2 = SquareUtils.toCoordinates(square2)
    
    const fileDiff = Math.abs(coords2.file - coords1.file)
    const rankDiff = Math.abs(coords2.rank - coords1.rank)
    
    return fileDiff === rankDiff && fileDiff > 0
  }
}
