import { ChessMetricsAPI } from '../ui/src/api'

// Initialize the global chessmetrics object
declare global {
  interface Window {
    chessmetrics: ChessMetricsAPI
  }
}

// Create and expose the global API
window.chessmetrics = new ChessMetricsAPI()

console.log('♟️ Chessmetrics userscript loaded!')
console.log('📊 Available: window.chessmetrics.standard.fen(fenString)')
console.log('🎯 Available: window.chessmetrics.detectBoard()')
console.log('🔍 Available: window.chessmetrics.debugPage()')
console.log('🚀 Available: window.chessmetrics.startMoveTracking()')
console.log('⏹️ Available: window.chessmetrics.stopMoveTracking()')
console.log('📈 Available: window.chessmetrics.isMoveTrackingActive()')
console.log('🔧 Available: window.chessmetrics.setDebugMode(true/false)')
console.log('🔧 Available: window.chessmetrics.isDebugMode()')