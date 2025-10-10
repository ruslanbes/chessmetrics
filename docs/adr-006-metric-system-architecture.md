# ADR-006: Metric System Architecture - Public/Private Metrics with Circular References

## Status
Accepted

## Context
We need to design a metric system architecture that:
- Supports auto-discovery of metrics
- Handles complex chess analysis with interdependencies
- Provides clean API responses without circular references
- Enables efficient calculations using object references
- Supports both simple and complex metric relationships
- Allows metrics to reference other objects (pieces, squares, players)

## Decision
We will implement a **two-tier metric system** with:
1. **Public Metrics**: Simple values returned in API responses
2. **Private/Helper Metrics**: Complex objects with circular references for internal calculations
3. **Circular Reference Architecture**: Full object graph with bidirectional references
4. **Custom Serialization**: Extract only public metrics for API responses

## Rationale

### Pros:
- ✅ **Rich Internal Model**: Full object graph enables complex chess analysis
- ✅ **Clean API Responses**: Simple, non-circular JSON for clients
- ✅ **Efficient Calculations**: Direct object references eliminate lookups
- ✅ **Type Safety**: Full TypeScript support for circular structures
- ✅ **Extensibility**: Easy to add new metrics and relationships
- ✅ **Performance**: No performance penalty for circular references in JavaScript
- ✅ **Natural Chess Modeling**: Mirrors real chess relationships (pieces attack squares, squares are attacked by pieces)

### Cons:
- ❌ **Serialization Complexity**: Requires custom serialization logic
- ❌ **Memory Usage**: Full object graph uses more memory
- ❌ **Debugging Complexity**: Circular references can complicate debugging
- ❌ **Cache Complexity**: Caching circular structures requires special handling

### Alternatives Considered:
- **Flat Structure**: Simple key-value pairs without references
  - ❌ Requires lookups for every relationship
  - ❌ Poor performance for complex calculations
  - ❌ Difficult to model natural chess relationships

- **Hierarchical Structure**: Tree-like structure without circular references
  - ❌ Cannot model bidirectional relationships
  - ❌ Limited expressiveness for chess analysis

- **Graph Database**: External graph database for relationships
  - ❌ Adds infrastructure complexity
  - ❌ Overkill for in-memory calculations
  - ❌ Performance overhead

## Architecture Design

### Metric Categories

#### Public Metrics (API Response)
```typescript
interface PublicChessMetrics {
  version: string
  fen: string
  pieces: PublicPieceMetrics[]
  squares: PublicSquareMetrics[]
  players: {
    white: PublicPlayerMetrics
    black: PublicPlayerMetrics
  }
}

interface PublicPieceMetrics {
  square: string
  color: 'white' | 'black'
  type: 'pawn' | 'rook' | 'bishop' | 'knight' | 'queen' | 'king'
  freedom: number
  isAttacked: boolean
  isHanging: boolean
  numberOfAttackers: number
}

interface PublicSquareMetrics {
  square: string
  color: 'light' | 'dark'
  occupied: boolean
  numberOfWhiteAttackers: number
  numberOfBlackAttackers: number
}

interface PublicPlayerMetrics {
  isMyTurn: boolean
  kingFreedom: number
  control: number
  canCastleLong: boolean
  canCastleShort: boolean
}
```

#### Private/Helper Metrics (Internal)
```typescript
interface PrivateChessStructure {
  pieces: PieceWithReferences[]
  squares: SquareWithReferences[]
  players: {
    white: PlayerWithReferences
    black: PlayerWithReferences
  }
}

interface PieceWithReferences {
  // Public metrics
  color: 'white' | 'black'
  type: 'pawn' | 'rook' | 'bishop' | 'knight' | 'queen' | 'king'
  freedom: number
  isAttacked: boolean
  isHanging: boolean
  numberOfAttackers: number
  
  // Private helper metrics (circular references)
  attackedSquares: SquareWithReferences[]
  defendedSquares: SquareWithReferences[]
  defendingPieces: PieceWithReferences[]
  pinnedBy: PieceWithReferences | null
}

interface SquareWithReferences {
  // Public metrics
  color: 'light' | 'dark'
  occupied: boolean
  numberOfWhiteAttackers: number
  numberOfBlackAttackers: number
  
  // Private helper metrics (circular references)
  attackers: PieceWithReferences[]
  defenders: PieceWithReferences[]
  controllingPieces: PieceWithReferences[]
  piece: PieceWithReferences | null
}
```

### Implementation Phases

#### Phase 1: Build Circular Structure
```typescript
class ChessStructureBuilder {
  build(board: ChessBoard): PrivateChessStructure {
    // Step 1: Create all objects without references
    const pieces = this.createPieces(board)
    const squares = this.createSquares(board)
    const players = this.createPlayers(board)
    
    // Step 2: Build circular references
    this.buildPieceToSquareReferences(pieces, squares)
    this.buildSquareToPieceReferences(squares, pieces)
    this.buildPlayerReferences(players, pieces, squares)
    
    return { pieces, squares, players }
  }
  
  private buildPieceToSquareReferences(pieces: PieceWithReferences[], squares: SquareWithReferences[]) {
    for (const piece of pieces) {
      piece.attackedSquares = this.getAttackedSquares(piece, squares)
      piece.defendedSquares = this.getDefendedSquares(piece, squares)
    }
  }
  
  private buildSquareToPieceReferences(squares: SquareWithReferences[], pieces: PieceWithReferences[]) {
    for (const square of squares) {
      square.attackers = this.getAttackers(square, pieces)
      square.defenders = this.getDefenders(square, pieces)
      square.piece = this.getPieceOnSquare(square, pieces)
    }
  }
}
```

#### Phase 2: Calculate Metrics
```typescript
class MetricCalculator {
  calculate(structure: PrivateChessStructure): PrivateChessStructure {
    // Use circular references for efficient calculations
    for (const piece of structure.pieces) {
      piece.freedom = this.calculateFreedom(piece)
      piece.isAttacked = piece.attackers.length > 0
      piece.isHanging = piece.defenders.length === 0 && piece.attackers.length > 0
      piece.numberOfAttackers = piece.attackers.length
    }
    
    for (const square of structure.squares) {
      square.numberOfWhiteAttackers = square.attackers.filter(p => p.color === 'white').length
      square.numberOfBlackAttackers = square.attackers.filter(p => p.color === 'black').length
    }
    
    return structure
  }
}
```

#### Phase 3: Serialize for API
```typescript
class ResponseSerializer {
  serialize(structure: PrivateChessStructure): PublicChessMetrics {
    return {
      version: this.getVersion(),
      fen: structure.fen,
      pieces: this.serializePieces(structure.pieces),
      squares: this.serializeSquares(structure.squares),
      players: this.serializePlayers(structure.players)
    }
  }
  
  private serializePieces(pieces: PieceWithReferences[]): PublicPieceMetrics[] {
    return pieces.map(piece => ({
      square: piece.square,
      color: piece.color,
      type: piece.type,
      freedom: piece.freedom,
      isAttacked: piece.isAttacked,
      isHanging: piece.isHanging,
      numberOfAttackers: piece.numberOfAttackers
      // Exclude: attackedSquares, defendedSquares, etc. (circular refs)
    }))
  }
}
```

## Consequences

### Positive:
- **Natural Chess Modeling**: Mirrors real chess relationships
- **Efficient Calculations**: Direct object references
- **Clean API**: Simple JSON responses
- **Extensible**: Easy to add new metrics
- **Type Safe**: Full TypeScript support

### Negative:
- **Memory Usage**: Full object graph uses more memory
- **Serialization Complexity**: Custom serialization required
- **Debugging**: Circular references can complicate debugging
- **Cache Complexity**: Special handling needed for caching

### Risks:
- **Memory Leaks**: Improper cleanup of circular references
- **Serialization Errors**: JSON.stringify() will fail
- **Performance**: Large object graphs may impact performance
- **Cache Invalidation**: Complex cache invalidation logic

## Implementation Notes:

### Memory Management (MVP):
- **Rebuild Per Request**: Create fresh circular structure for each request
- **Garbage Collection**: JavaScript handles circular references correctly
- **No Persistence**: No in-memory caching for MVP
- **Simple Cleanup**: Let garbage collector handle cleanup

### Serialization Strategy:
- **Custom Serializer**: Implement custom serialization logic
- **Public Filter**: Only include public metrics in API responses
- **Validation**: Validate serialized output

### Caching Strategy (MVP):
- **No Caching**: Skip caching for MVP simplicity
- **Future Enhancement**: Add caching in later iterations
- **File System Only**: Use only file system caching for responses

### Error Handling:
- **Circular Reference Errors**: Handle JSON.stringify() errors gracefully
- **Memory Errors**: Handle out-of-memory scenarios
- **Validation Errors**: Validate circular structure integrity

## Questions to Resolve:

1. **Memory Management**: Should we keep the full structure in memory or rebuild per request?
   - **Decision**: Rebuild per request for MVP (KISS principle)
2. **Caching Strategy**: How do we cache circular structures effectively?
   - **Decision**: No caching for MVP
3. **Performance**: Is the circular structure overhead worth the calculation benefits?
4. **Serialization**: Should we use a library like `flatted` or implement custom serialization?
5. **Error Handling**: How do we handle circular reference errors gracefully?

## Future Considerations:

- **Graph Algorithms**: Leverage circular structure for graph-based chess analysis
- **Advanced Metrics**: Complex tactical patterns using object relationships
- **Performance Optimization**: Optimize circular structure building
- **Memory Optimization**: Implement memory-efficient circular structures
