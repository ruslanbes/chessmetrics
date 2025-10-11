// ==UserScript==
// @name         Chessmetrics
// @namespace    https://github.com/ruslanbes/chessmetrics
// @version      1.0.0
// @description  Chess position analysis and metrics for chess.com and lichess.org
// @author       Chessmetrics Team
// @match        https://www.chess.com/*
// @match        https://lichess.org/*
// @grant        none
// chess.js is now bundled directly - no external dependency needed
// ==/UserScript==

import { ChessMetricsAPI } from './api'

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
