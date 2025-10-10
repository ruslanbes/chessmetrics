/**
 * Main FEN extractor that orchestrates all extraction strategies
 */

import { FenExtractionStrategy, FenExtractionResult } from './fen-extraction-strategy'
import { ChessgroundFenExtractor } from './strategies/chessground-fen-extractor'
import { DomAttributeFenExtractor } from './strategies/dom-attribute-fen-extractor'
import { UrlFenExtractor } from './strategies/url-fen-extractor'
import { PageDataFenExtractor } from './strategies/page-data-fen-extractor'
import { MoveFenExtractor } from './strategies/move-fen-extractor'
import { BoardReconstructionFenExtractor } from './strategies/board-reconstruction-fen-extractor'

export class LichessFenExtractor {
  private strategies: FenExtractionStrategy[]

  constructor() {
    // Initialize strategies in order of preference
    this.strategies = [
      new ChessgroundFenExtractor(),
      new DomAttributeFenExtractor(),
      new UrlFenExtractor(),
      new PageDataFenExtractor(),
      new MoveFenExtractor(),
      new BoardReconstructionFenExtractor()
    ]
  }

  /**
   * Extract FEN from a board element using all available strategies
   */
  extractFen(element: HTMLElement): string | undefined {
    for (const strategy of this.strategies) {
      const strategyName = strategy.constructor.name
      const canExtract = strategy.canExtract(element)
      
      if (canExtract) {
        const result = strategy.extractFen(element)
        
        if (result.fen) {
          console.log(`✅ FEN extracted using ${result.source} strategy:`, result.fen)
          return result.fen
        }
      }
    }
    
    console.warn('❌ No FEN could be extracted from element')
    return undefined
  }

  /**
   * Get debug information about FEN extraction attempts
   */
  debugFenExtraction(element: HTMLElement): Array<{ strategy: string; canExtract: boolean; result: FenExtractionResult }> {
    const debugInfo: Array<{ strategy: string; canExtract: boolean; result: FenExtractionResult }> = []
    
    for (const strategy of this.strategies) {
      const canExtract = strategy.canExtract(element)
      const result = canExtract ? strategy.extractFen(element) : { source: 'none' as const }
      
      debugInfo.push({
        strategy: strategy.constructor.name,
        canExtract,
        result
      })
    }
    
    return debugInfo
  }
}
