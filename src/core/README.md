# Core Chess Logic

This directory contains the core chess functionality, utilities, and shared logic used throughout the application.


## Core Components

### Chess Integration
- **Board Management**: Wrapper around chess.js for consistent API
- **Move Generation**: Legal move calculation and validation
- **Position Analysis**: Basic chess position analysis

### Metrics Framework
- **Auto-discovery**: Automatic discovery of metric implementations via build-time code generation
- **Calculation Engine**: Orchestrates metric calculations with dependency management
- **Registry System**: Auto-generated registry of all available metrics

## Key Components

### ChessBoard
Wrapper around chess.js that provides a consistent API for chess operations including position management, move generation, and game state validation.

### MetricCalculator
Orchestrates metric calculations with auto-discovery and dependency management. Handles the execution of all available metrics for a given chess position.

### Auto-Generated Registry
The metric registry is automatically generated at build time, containing all discovered metrics and their metadata for runtime execution.

## Chess Analysis

### Basic Analysis
- **Piece Positions**: Get all pieces and their positions
- **Legal Moves**: Generate all legal moves for a position
- **Turn Detection**: Determine whose turn it is
- **Position Validation**: Check if position is valid

### Metrics Analysis
- **Player Metrics**: Calculate player-specific metrics
- **Piece Metrics**: Calculate piece-specific metrics
- **Auto-Discovery**: Metrics are automatically discovered and registered
- **Dependency Management**: Metrics can depend on other metrics

## Build Process

### Registry Generation
The metric registry is automatically generated during build using the `generate:registry` script. This process scans the metrics directory for metric files, extracts class names and metadata, and generates the registry with import statements and type definitions.

## Development Guidelines

1. **Chess.js Integration**: Use chess.js as the foundation
2. **Error Handling**: Validate all inputs and handle errors gracefully
3. **Performance**: Optimize for 100 requests per second
4. **Caching**: Cache expensive calculations
5. **Testing**: Unit test all core functionality
6. **Documentation**: Document all public APIs

## Dependencies

- **chess.js**: Core chess functionality
- **TypeScript**: Type definitions and compilation

## Performance Considerations

### Optimization Strategies
- **Instance Reuse**: Reuse chess.js instances when possible
- **Lazy Loading**: Load expensive calculations only when needed
- **Caching**: Cache frequently accessed data
- **Batch Operations**: Process multiple operations together

### Memory Management
- **Cleanup**: Properly dispose of chess.js instances
- **Garbage Collection**: Avoid memory leaks in long-running processes
- **Resource Limits**: Monitor memory usage and implement limits

## Error Handling

### Common Errors
- **Invalid FEN**: Handle malformed FEN strings
- **Invalid Moves**: Handle illegal move attempts
- **Memory Issues**: Handle out-of-memory scenarios
- **Concurrency**: Handle concurrent access safely

### Recovery Strategies
- **Graceful Degradation**: Continue operation with reduced functionality
- **Retry Logic**: Retry failed operations with backoff
- **Logging**: Log all errors for debugging
- **Monitoring**: Monitor error rates and performance
