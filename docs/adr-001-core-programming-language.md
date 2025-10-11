# ADR-001: Core Programming Language - JavaScript/TypeScript

## Status
Accepted

## Context
We need to choose a core programming language for the chessmetrics web server that:
- Receives HTTP requests with FEN positions
- Calculates various chessmetrics (boolean, numerical, enum values)
- Returns JSON responses with board analysis
- Supports auto-discovery of metrics
- Enables future browser userscript development
- Handles 100 requests per second with caching

## Decision
We will use **JavaScript/TypeScript** as the core programming language.

## Rationale

### Pros:
- **Browser Compatibility**: Future browser userscript development - same code can run in both server and browser
- **Rich Chess Ecosystem**: Libraries available (chess.js, stockfish.js)
- **Auto-discovery Support**: Dynamic imports and module loading for auto-discovery
- **Web API Excellence**: Mature ecosystem for building web APIs and static file serving
- **TypeScript Benefits**: Static typing
- **Community & Documentation**: Community, documentation
- **WASM Compatibility**: Compile performance-critical parts to WebAssembly if needed

### Cons:
- **Performance Limitations**: Single-threaded
- **Memory Management**: Less efficient than compiled languages like Rust/C++
- **Runtime Overhead**: Interpreted language with performance overhead compared to compiled alternatives

### Alternatives Considered:
- **Rust**: Excellent performance but steeper learning curve and limited chess library ecosystem
- **Go**: Good concurrency but no direct browser compatibility and limited chess libraries
- **Python**: Rich chess libraries but slower performance and no browser compatibility


## Implementation Notes:
- Use TypeScript for better type safety and development experience
- Consider WebAssembly for performance-critical chess engine components
- Implement worker threads for CPU-intensive metric calculations if needed
- Monitor performance and optimize as the metric library grows
