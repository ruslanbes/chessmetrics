// Common chess positions for testing
export const CHESS_POSITIONS = {
  // Starting position
  STARTING: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  
  // After 1.e4 (normalized by chess.js)
  AFTER_E4: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  
  // After 1.e4 e5 (normalized by chess.js)
  AFTER_E4_E5: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
  
  // After 1.e4 e5 2.Nf3
  AFTER_E4_E5_NF3: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
  
  // Checkmate position (Fool's Mate)
  FOOLS_MATE: 'rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3',
  
  // En passant position
  EN_PASSANT: 'rnbqkbnr/ppp1pppp/8/3pP3/8/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 3',
  
  // Castling position
  CASTLING: 'r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1',
  
  // Complex position
  GIUOCO_PIANISSIMO: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 4 4',
  
  // Queen's Gambit opening (after 1.c4)
  QUEENS_GAMBIT: 'rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2',
  
  // Petrov's Defence (e4 and e5 are both hanging)
  PETROV_DEFENCE: 'rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3'
}

// Endgame positions
export const ENDINGS = {
  // Rooks and kings endgame (black rook on f4 is pinned)
  ROOKS_AND_KINGS: '8/8/8/8/2R2rk1/1K6/8/8 b - - 0 1',
  
  // Only kings (stalemate position)
  KINGS_ONLY: '4k3/8/8/8/8/8/8/4K3 w - - 0 1'
}

// Invalid FENs for error testing
export const INVALID_FENS = [
  'invalid-fen',
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR', // Missing turn
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w', // Missing castling
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq', // Missing en passant
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -', // Missing move numbers
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0', // Missing half-move clock
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR x KQkq - 0 1', // Invalid turn
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w XQkq - 0 1' // Invalid castling
]
