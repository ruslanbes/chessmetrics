# ADR-005: Chess Library - chess.js

## Status
Accepted

## Context
We need to choose a chess library for the chessmetrics server that:
- Parses and validates FEN strings
- Provides board state analysis capabilities
- Calculates legal moves and piece positions
- Supports piece and square analysis
- Works well with JavaScript/TypeScript
- Has good performance for 100 requests per second
- Is actively maintained and has good documentation
- Can be used in both server and browser environments

## Decision
We will use **chess.js** as the core chess library.

## Rationale

### Pros:
- ✅ **Mature and Stable**: Well-established library with 7+ years of development
- ✅ **Excellent API**: Clean, intuitive API for board manipulation and analysis
- ✅ **FEN Support**: Built-in FEN parsing and validation
- ✅ **Move Generation**: Comprehensive legal move generation
- ✅ **Board Analysis**: Built-in methods for piece positions, attacks, and board state
- ✅ **TypeScript Support**: Good TypeScript definitions available
- ✅ **Browser Compatible**: Works in both Node.js and browser environments
- ✅ **Active Maintenance**: Regularly updated with bug fixes and improvements
- ✅ **Good Documentation**: Comprehensive documentation and examples
- ✅ **Lightweight**: Small bundle size (~50KB minified)
- ✅ **No Dependencies**: Self-contained library with no external dependencies

### Cons:
- ❌ **Limited Engine Features**: Not a full chess engine (no AI, evaluation functions)
- ❌ **Performance**: May not be as fast as compiled chess engines for very complex analysis
- ❌ **Limited Analysis**: Basic analysis features compared to engines like Stockfish

### Alternatives Considered:
- **stockfish.js**: More powerful but much heavier (~2MB), overkill for our needs
- **Custom Implementation**: More control but significant development time
- **python-chess (via WASM)**: More features but complex integration and larger bundle

## Consequences

### Positive:
- Rapid development with proven, stable library
- Easy integration with our TypeScript/Node.js stack
- Good performance for our expected traffic (100 req/sec)
- Excellent foundation for building custom metrics
- Browser compatibility for future userscript development
- Simple API makes it easy for contributors to add new metrics

### Negative:
- Limited to basic chess operations (no advanced engine features)
- May need performance optimization for very complex metric calculations
- Some advanced chess analysis may need custom implementation

### Risks:
- Performance bottlenecks for very complex metric calculations
- May need to supplement with custom analysis for advanced metrics
- Library updates could potentially break existing code

## Implementation Notes:
- Install chess.js via npm: `npm install chess.js`
- Use TypeScript definitions: `npm install @types/chess.js`
- Initialize with FEN: `new Chess(fenString)`
- Leverage built-in methods for basic analysis
- Implement custom metrics on top of chess.js foundation
- Consider caching chess.js instances for performance
- Use chess.js for move validation and legal move generation
- Build custom analysis methods for advanced metrics

## Key chess.js Methods We'll Use:
- `new Chess(fen)` - Initialize board from FEN
- `chess.moves()` - Get all legal moves
- `chess.get(square)` - Get piece on square
- `chess.attacked(square, color)` - Check if square is attacked
- `chess.inCheck()` - Check if king is in check
- `chess.inCheckmate()` - Check for checkmate
- `chess.inStalemate()` - Check for stalemate
- `chess.fen()` - Get current FEN string
