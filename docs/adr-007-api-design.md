# ADR-007: API Design - Extensible Chess Analysis API

## Status
Accepted

## Context
We need to design a REST API for the chessmetrics service that:
- Analyzes chess positions and returns metrics
- Supports different input formats (FEN, PGN)
- Supports future extensions for chess variants
- Provides clean, intuitive endpoints
- Supports versioning and backward compatibility
- Enables easy integration by chess websites and engines

## Decision
We will implement a **variant-format-based API structure** with:
1. **Variant-Specific Endpoints**: `/api/v1/standard/fen/:fen`, `/api/v1/atomic/fen/:fen`, etc.
2. **Format Support**: FEN and PGN analysis for each variant
3. **Clean URL Structure**: Variant and format in path, no query parameters
4. **RESTful Design**: Standard HTTP methods and status codes
5. **Versioned API**: Clear versioning strategy

## Rationale

### Pros:
- ✅ **Clean URLs**: Simple, intuitive endpoint structure
- ✅ **Variant Clarity**: Clear distinction between chess variants
- ✅ **Format Support**: FEN and PGN for each variant
- ✅ **No Query Parameters**: Clean URLs without special characters
- ✅ **RESTful Design**: Standard HTTP conventions
- ✅ **Client Integration**: Easy for chess websites to integrate
- ✅ **SEO Friendly**: Clean, readable URLs
- ✅ **FEN Safe**: No "?" characters in FEN URLs

### Cons:
- ❌ **More Endpoints**: Multiple endpoints for each variant/format combination
- ❌ **Code Duplication**: Similar logic across variants
- ❌ **Documentation**: More endpoints to document

### Alternatives Considered:
- **Query Parameters**: `/api/v1/fen/:fen?variant=atomic`
  - ❌ FEN strings can't contain "?" characters
  - ❌ PGN comments may contain "?" characters
  - ❌ URL encoding complexity

- **Hierarchical Path**: `/api/v1/standard/analyze/:fen`
  - ❌ Less clear about variant and format
  - ❌ Harder to extend for new variants

## API Design

### Core Endpoints

#### Standard Chess FEN Analysis
```
GET /api/v1/standard/fen/:fen
```
Analyzes a standard chess position from FEN string.

**Parameters:**
- `fen` (path): FEN string representing the chess position

**Example:**
```
GET /api/v1/standard/fen/rnbqkbnr%2Fpppppppp%2F8%2F8%2F8%2F8%2FPPPPPPPP%2FRNBQKBNR%20w%20KQkq%20-%200%201
```


**Response:**
```json
{
  "version": "1.0.0",
  "input": {
    "type": "fen",
    "value": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  },
  "gameType": "standard",
  "pieces": [...],
  "squares": [...],
  "players": {
    "white": {...},
    "black": {...}
  }
}
```

#### Standard Chess PGN Analysis
```
GET /api/v1/standard/pgn/:pgn
```
Analyzes a standard chess game from PGN string.

**Parameters:**
- `pgn` (path): PGN string representing the chess game

**Example:**
```
GET /api/v1/standard/pgn/1.%20e4%20e5%202.%20Nf3%20Nc6%203.%20Bb5
```

**Response:**
```json
{
  "version": "1.0.0",
  "input": {
    "type": "pgn",
    "value": "1. e4 e5 2. Nf3 Nc6 3. Bb5",
    "position": 10
  },
  "gameType": "standard",
  "pieces": [...],
  "squares": [...],
  "players": {
    "white": {...},
    "black": {...}
  },
  "gameInfo": {
    "moves": 10,
    "currentFen": "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 4"
  }
}
```

#### Health Check
```
GET /api/v1/health
```
Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600
}
```

### Future Extensions

#### Chess Variants
```
GET /api/v1/atomic/fen/:fen
GET /api/v1/atomic/pgn/:pgn
GET /api/v1/crazyhouse/fen/:fen
GET /api/v1/crazyhouse/pgn/:pgn
GET /api/v1/kingofthehill/fen/:fen
GET /api/v1/kingofthehill/pgn/:pgn
GET /api/v1/threecheck/fen/:fen
GET /api/v1/threecheck/pgn/:pgn
```

#### Additional Input Formats
```
GET /api/v1/standard/uci/:uci
GET /api/v1/standard/san/:san
GET /api/v1/atomic/uci/:uci
GET /api/v1/crazyhouse/san/:san
```

#### Batch Analysis
```
POST /api/v1/standard/batch
```

### Response Structure

#### Standard Response Format
```typescript
interface ChessAnalysisResponse {
  version: string
  input: {
    type: 'fen' | 'pgn' | 'uci' | 'san'
    value: string
    position?: number  // For PGN analysis
  }
  gameType: 'standard' | 'atomic' | 'crazyhouse' | 'kingofthehill'
  pieces: PieceMetrics[]
  squares: SquareMetrics[]
  players: {
    white: PlayerMetrics
    black: PlayerMetrics
  }
  gameInfo?: {        // For PGN analysis
    moves: number
    currentFen: string
    gameResult?: string
  }
  metadata?: {
    analysisTime: number
    cacheHit: boolean
    requestId: string
  }
}
```

#### Piece Metrics
```typescript
interface PieceMetrics {
  square: string
  color: 'white' | 'black'
  type: 'pawn' | 'rook' | 'bishop' | 'knight' | 'queen' | 'king'
  freedom: number
  isAttacked: boolean
  isHanging: boolean
  numberOfAttackers: number
  // Future: variant-specific metrics
  // Future: PGN-specific metrics (e.g., timesMoved, lastMoved)
}
```

#### Square Metrics
```typescript
interface SquareMetrics {
  square: string
  color: 'light' | 'dark'
  occupied: boolean
  numberOfWhiteAttackers: number
  numberOfBlackAttackers: number
  // Future: variant-specific metrics
}
```

#### Player Metrics
```typescript
interface PlayerMetrics {
  isMyTurn: boolean
  kingFreedom: number
  control: number
  canCastleLong: boolean
  canCastleShort: boolean
  // Future: variant-specific metrics
  // Future: PGN-specific metrics (e.g., timeSpent, averageMoveTime)
}
```

### Error Handling

#### Error Response Format
```typescript
interface ErrorResponse {
  error: {
    code: string
    message: string
    details?: string
    field?: string
  }
  timestamp: string
  requestId?: string
}
```

#### Common Error Codes
- `INVALID_FEN`: Malformed FEN string
- `INVALID_PGN`: Malformed PGN string
- `INVALID_VARIANT`: Unsupported game variant
- `INVALID_POSITION`: Invalid position number for PGN
- `ANALYSIS_ERROR`: Error during analysis
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Server error

#### HTTP Status Codes
- `200 OK`: Successful analysis
- `400 Bad Request`: Invalid input
- `404 Not Found`: Endpoint not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

### Input Validation

#### FEN Validation
- **Format**: 6 space-separated fields
- **Pieces**: Valid piece notation (KQRBNP/kqrbnp)
- **Turn**: 'w' or 'b'
- **Castling**: Valid castling rights
- **En Passant**: Valid en passant square
- **Halfmove**: Non-negative integer
- **Fullmove**: Positive integer

#### PGN Validation
- **Format**: Valid PGN notation
- **Moves**: Legal chess moves
- **Game Result**: Valid game termination
- **Position**: Valid position number (if specified)

#### Variant Validation
- **Standard**: Default chess rules
- **Atomic**: Pieces explode on capture
- **Crazyhouse**: Captured pieces can be dropped
- **King of the Hill**: King in center wins

## Implementation Strategy

### Phase 1: MVP (Standard Chess)
- Implement `/api/v1/standard/fen/:fen`
- Support standard chess only
- Basic error handling
- Simple response format

### Phase 2: PGN Support
- Implement `/api/v1/standard/pgn/:pgn`
- Add game information to response
- Position-specific analysis

### Phase 3: Chess Variants
- Add atomic chess support
- Add crazyhouse chess support
- Add king of the hill support
- Implement variant-specific metrics

### Phase 4: Advanced Features
- Additional input formats (UCI, SAN)
- Batch processing
- Real-time analysis

## Routing Structure

### Express.js Implementation (MVP)
```typescript
// Standard chess router
app.use('/api/v1/chess', chessRouter)

// Format endpoints for standard chess
chessRouter.get('/fen/:fen', analyzeStandardFEN)
chessRouter.get('/pgn/:pgn', analyzeStandardPGN)

// Future extensions
chessRouter.get('/uci/:uci', analyzeStandardUCI)
chessRouter.get('/san/:san', analyzeStandardSAN)
chessRouter.post('/batch', analyzeBatch)
```

### Middleware Stack
```typescript
// Request processing pipeline
app.use('/api/v1/chess', [
  rateLimitMiddleware,      // Rate limiting
  corsMiddleware,           // CORS handling
  requestLoggingMiddleware, // Request logging
  validationMiddleware,     // Input validation
  analysisMiddleware,       // Chess analysis
  responseMiddleware        // Response formatting
])
```

## Consequences

### Positive:
- **Clean URLs**: Simple, intuitive endpoint structure
- **Format Clarity**: Clear distinction between input formats
- **Extensibility**: Easy to add new input formats
- **Variant Support**: Flexible variant handling
- **Client Integration**: Easy for chess websites to use
- **RESTful**: Standard HTTP conventions

### Negative:
- **Code Duplication**: Similar logic for different formats
- **Parameter Handling**: Variants via query parameters
- **Documentation**: Multiple endpoints to maintain
- **Testing**: More test cases required

### Risks:
- **Breaking Changes**: API versioning complexity
- **Performance**: Multiple validation layers
- **Security**: More attack surface
- **Maintenance**: More code to maintain

## Implementation Notes:

### URL Encoding:
- **FEN Strings**: URL encode FEN strings for path parameters
- **PGN Strings**: URL encode PGN strings for path parameters
- **Special Characters**: Handle spaces and special characters
- **Validation**: Validate URL-encoded strings

### Caching Strategy:
- **Cache Key**: Include input type and variant in cache key
- **Version Management**: Cache invalidation per format
- **Performance**: Optimize for different input formats

### Error Handling:
- **Validation**: Comprehensive input validation
- **Error Codes**: Consistent error code system
- **Logging**: Detailed error logging
- **Monitoring**: Error rate monitoring

## Future Considerations:

### Advanced Features:
- **Real-time Analysis**: WebSocket support for live analysis
- **Batch Processing**: Analyze multiple positions
- **Custom Metrics**: User-defined metric calculations
- **Performance Analytics**: Analysis performance metrics

### Integration:
- **Chess Websites**: Easy integration for Lichess, Chess.com
- **Chess Engines**: Support for engine integration
- **Mobile Apps**: Mobile-friendly API design
- **Browser Extensions**: Browser extension support
