import { ChessMetricsResponse } from './types'

export class ChessMetricsAPI {
  standard = {
    fen: (fenString: string): ChessMetricsResponse => {
      // For now, return a placeholder response
      // This will be replaced with actual metrics calculation later
      return {
        version: '1.0.0',
        fen: fenString,
        gameType: 'standard',
        pieces: [],
        players: {
          white: {
            isMyTurn: false
          },
          black: {
            isMyTurn: false
          }
        }
      }
    }
  }
}
