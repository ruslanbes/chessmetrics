# ADR-009: Coordinate System Design - String Literals with Utility Functions

## Status
Accepted

## Context
We need to design a coordinate system for chess square representation that:
- Works seamlessly with the chess.js library
- Provides efficient coordinate calculations for geometric analysis
- Maintains API compatibility with existing clients
- Supports both string notation ('e4') and numerical coordinates (file: 4, rank: 4)
- Enables clean, maintainable code without repetitive coordinate conversions
- Handles pin detection, attack analysis, and geometric calculations
- Supports 100+ requests per second with minimal overhead

## Decision
We will implement a **hybrid coordinate system** with:
1. **Square Type**: String literal type for chess.js compatibility and API responses
2. **SquareCoordinates Interface**: Object interface for internal coordinate calculations
3. **SquareUtils Class**: Utility functions for coordinate conversion and geometric analysis
4. **Piece Interface**: Enhanced with direct file/rank properties for convenience

## Rationale

### Pros:
- ✅ **chess.js Compatibility**: String literals work seamlessly with chess.js methods
- ✅ **API Compatibility**: Existing clients receive familiar string responses
- ✅ **Type Safety**: String literal types provide compile-time validation
- ✅ **Performance**: Lightweight strings with minimal memory overhead
- ✅ **Flexibility**: Multiple access patterns (string, coordinates, direct properties)
- ✅ **Maintainability**: Centralized coordinate logic in SquareUtils
- ✅ **Extensibility**: Easy to add new geometric analysis methods

### Cons:
- ❌ **Type Duplication**: Both SquareCoordinates interface and direct file/rank properties
- ❌ **Conversion Overhead**: Occasional string-to-coordinate conversions
- ❌ **Design Inconsistency**: SquareCoordinates interface exists but Piece uses direct properties

### Alternatives Considered:

#### **Option 1: Pure String Literals**
```typescript
type Square = 'a8' | 'b8' | 'c8' | ...
// Manual coordinate calculations everywhere
const file = square.charCodeAt(0) - 97
const rank = 8 - parseInt(square[1])
```
- ❌ **Repetitive Code**: Coordinate calculations scattered throughout codebase
- ❌ **Error-Prone**: Manual calculations prone to mistakes
- ❌ **Maintenance Burden**: Changes require updates in multiple places

#### **Option 2: Pure Object-Based**
```typescript
interface Square {
  square: string
  file: number
  rank: number
}
```
- ❌ **Breaking Changes**: Incompatible with chess.js library
- ❌ **API Breaking**: Existing clients would break
- ❌ **Performance Loss**: Objects vs lightweight strings
- ❌ **Type Safety Loss**: No compile-time square validation

#### **Option 3: Union Type**
```typescript
type Square = string | SquareCoordinates
```
- ❌ **Type Confusion**: Unclear which representation to use when
- ❌ **Runtime Checks**: Need type guards everywhere
- ❌ **API Inconsistency**: Mixed response formats


## Consequences

### Positive:
- **chess.js Compatibility**: Seamless integration with chess.js library
- **API Stability**: No breaking changes to existing clients
- **Performance**: Lightweight strings with efficient coordinate access
- **Type Safety**: Compile-time validation of valid squares
- **Code Clarity**: Multiple access patterns for different use cases
- **Maintainability**: Centralized coordinate logic in SquareUtils
- **Extensibility**: Easy to add new geometric analysis methods

### Negative:
- **Type Duplication**: Both SquareCoordinates interface and direct properties exist
- **Learning Curve**: Developers need to understand multiple access patterns
- **Design Inconsistency**: SquareCoordinates interface exists but isn't used in Piece
- **Memory Overhead**: Pieces store both string and coordinate data

### Risks:
- **Inconsistency**: Developers might use different patterns inconsistently
- **Performance**: Coordinate calculations on every piece creation
- **Maintenance**: Need to keep multiple representations in sync
- **API Evolution**: Future changes might require breaking changes
- **Design Confusion**: SquareCoordinates interface exists but isn't used consistently

## Implementation Notes:

### Migration Strategy:
1. **Phase 1**: Add SquareUtils class and SquareCoordinates interface
2. **Phase 2**: Enhance Piece interface with file/rank properties
3. **Phase 3**: Refactor existing coordinate calculations to use new utilities
4. **Phase 4**: Update tests and documentation

### Performance Considerations:
- **Coordinate Caching**: Consider caching coordinate calculations for frequently accessed squares
- **Memory Optimization**: Monitor memory usage with enhanced Piece objects
- **Calculation Optimization**: Use direct properties for simple comparisons

### Code Standards:
- **Use Direct Properties**: Prefer `piece.file` and `piece.rank` for piece-based calculations
- **Use SquareUtils**: Use `SquareUtils` methods for square-based operations
- **Consistent Patterns**: Establish clear guidelines for when to use each pattern

### Testing Strategy:
- **Unit Tests**: Test all SquareUtils methods with edge cases
- **Integration Tests**: Verify chess.js compatibility
- **Performance Tests**: Monitor coordinate calculation overhead
- **Regression Tests**: Ensure no breaking changes to existing functionality

## Future Considerations:

### Potential Improvements:
- **Coordinate Caching**: Cache frequently used coordinate calculations
- **Lazy Loading**: Calculate coordinates only when needed
- **Memory Optimization**: Optimize Piece object memory usage
- **API Evolution**: Consider future API changes for better consistency

### Advanced Features:
- **Square Validation**: Add runtime validation for coordinate bounds
- **Geometric Algorithms**: Implement more complex geometric analysis methods
- **Performance Monitoring**: Add metrics for coordinate calculation performance
- **Type Safety**: Enhance TypeScript types for better compile-time checking

## Questions Resolved:

1. **Should we use objects or strings for squares?**
   - **Decision**: Strings for compatibility, objects for calculations
2. **How do we handle coordinate conversions?**
   - **Decision**: Centralized SquareUtils class with multiple access patterns
3. **Should Piece have direct coordinate properties?**
   - **Decision**: Yes, for convenience and performance
4. **How do we maintain API compatibility?**
   - **Decision**: Keep string-based API responses
5. **What's the performance impact?**
   - **Decision**: Minimal overhead, significant code clarity benefits

## Related ADRs:
- **ADR-005**: Chess Library - chess.js (compatibility requirements)
- **ADR-006**: Metric System Architecture (coordinate usage in metrics)
- **ADR-007**: API Design (string-based responses)
