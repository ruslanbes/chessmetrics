# Source Code Structure

This directory contains the main source code for the Chessmetrics API server.

## Directory Structure

```
src/
├── cache/            # File system caching implementation
├── core/             # Core chess logic and utilities
├── metrics/          # Auto-discoverable chessmetrics
│   ├── piece/       # Piece-related metrics
│   ├── square/      # Square-related metrics
│   └── player/        # Player-related metrics
├── types/            # TypeScript type definitions
└── index.ts          # Main Express.js application with API routes
```

## Key Concepts

### Metrics System
- **Auto-discovery**: Metrics are automatically discovered at runtime
- **Modular**: Each metric is in its own file/folder
- **Dependencies**: Metrics can call other metrics for calculations
- **Caching**: Intermediate results are cached to avoid recalculation

### API Design
- **RESTful**: Simple HTTP endpoints
- **FEN-based**: All requests use FEN strings to represent positions
- **JSON responses**: Structured JSON with version and FEN included

### Caching Strategy
- **File-based**: Cached responses stored as JSON files
- **Version-aware**: Cache invalidated when app version changes
- **Static serving**: Express serves cached files directly

## Development Guidelines

1. **TypeScript**: All code should be written in TypeScript
2. **Testing**: Unit tests for all metrics and core functions
3. **Documentation**: JSDoc comments for all public functions
4. **Error Handling**: Proper error handling and logging
5. **Performance**: Optimize for 100 requests per second
