# Chessmetrics

A chess position analysis API server that calculates various metrics for chess positions. Provides them via REST API and browser userscript.

## Purpose

Chessmetrics analyzes chess positions and returns calculated metrics like how many pieces attack a certain square from both sides, is the piece hanging, is the piece pinned, and so on. It can run as a standalone API server and can also be installed as a browser userscript for chess.com and lichess.org and run inside the browser.

## Components

- **API Server**: REST API for chess position analysis
- **Browser Userscript**: Client-side integration for chess websites
- **Metrics Engine**: Extensible system for calculating chess metrics

## Quick Start

```bash
npm install
npm run dev
curl "http://localhost:3000/api/v1/standard/fen/rnbqkbnr%2Fpppppppp%2F8%2F8%2F8%2F8%2FPPPPPPPP%2FRNBQKBNR%20w%20KQkq%20-%200%201"
```

## Documentation

- [API Documentation](docs/adr-007-api-design.md)
- [Source Code](src/README.md)
- [Userscript](userscript/README.md)
- [Architecture Decisions](docs/)
