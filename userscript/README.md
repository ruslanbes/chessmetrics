# Chessmetrics Userscript

A browser userscript that provides chess position analysis and metrics for chess.com and lichess.org.

## Features

- **Global API**: Access chessmetrics via `window.chessmetrics.standard.fen(fenString)`
- **Site Integration**: Automatically works on chess.com and lichess.org
- **Real-time Analysis**: Calculate metrics for any chess position

## Installation

1. Install a userscript manager:
   - [Tampermonkey](https://www.tampermonkey.net/) (Chrome, Firefox, Safari, Edge)
   - [Greasemonkey](https://www.greasespot.net/) (Firefox)
   - [Violentmonkey](https://violentmonkey.github.io/) (Chrome, Firefox, Edge)

2. Install the userscript:
   - Open the userscript manager
   - Click "Create new script"
   - Copy the contents of `dist/chessmetrics.user.js`
   - Save and enable the script

## Usage

Once installed, the userscript provides a global `chessmetrics` object:

```javascript
// In browser console or other scripts
const result = chessmetrics.standard.fen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')

console.log(result)
// {
//   version: "1.0.0",
//   fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
//   gameType: "standard",
//   pieces: [...],
//   players: {
//     white: { isMyTurn: true },
//     black: { isMyTurn: false }
//   }
// }
```

## Development

### Building

```bash
# Build the userscript
npm run build:userscript

# Watch mode for development
npm run dev:userscript
```

### Project Structure

```
userscript/
├── src/
│   ├── main.ts              # Main userscript entry point
│   ├── api.ts               # chessmetrics.standard.fen() API
│   ├── types.ts             # TypeScript type definitions
│   ├── sites/               # Site-specific integrations
│   ├── shared/              # Shared code from main app (copied during build)
│   └── utils/               # Utility functions
├── build/
│   └── webpack.config.js    # Webpack configuration
├── tests/                   # Test files
├── dist/
│   └── chessmetrics.user.js # Generated userscript file
└── README.md
```

### Code Sharing

The userscript shares code with the main application using build-time copying:

1. **Shared Code**: `src/shared/` contains copied files from the main app
2. **Build Process**: Webpack bundles everything into a single file
3. **Dependencies**: chess.js is loaded externally via CDN

## Supported Sites

- **chess.com**: All pages
- **lichess.org**: All pages

## API Reference

### `chessmetrics.standard.fen(fenString)`

Analyzes a chess position and returns calculated metrics.

**Parameters:**
- `fenString` (string): FEN notation of the chess position

**Returns:**
- `ChessMetricsResponse`: Object containing version, FEN, game type, pieces, and player metrics

**Example:**
```javascript
const metrics = chessmetrics.standard.fen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
console.log(metrics.players.white.isMyTurn) // true
```

## License

ISC License - see main project LICENSE file.
