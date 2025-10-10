# ADR-002: Web Framework - Node.js + Express

## Status
Accepted

## Context
We need to choose a web framework for the chessmetrics server that:
- Serves HTTP requests with FEN positions
- Returns JSON responses with chessmetrics
- Implements static file serving for cached responses
- Supports auto-discovery of metrics
- Handles 100 requests per second
- Provides middleware for caching and version management

## Decision
We will use **Node.js + Express.js** as the web framework.

## Rationale

### Pros:
- **Excellent Static File Serving**: Express has built-in `express.static()` middleware perfect for serving cached FEN responses
- **Simple Middleware Architecture**: Easy to implement caching, version checking, and metric auto-discovery
- **Mature Ecosystem**: Large community, extensive documentation, and proven in production
- **Lightweight and Fast**: Minimal overhead, good performance for API endpoints
- **Flexible Routing**: Easy to implement RESTful endpoints and custom middleware
- **JSON Handling**: Built-in JSON parsing and response formatting
- **Error Handling**: Robust error handling middleware and patterns
- **Development Tools**: Excellent debugging and development tooling

### Cons:
- **Single-threaded**: Limited by Node.js event loop for CPU-intensive tasks
- **Memory Usage**: Can consume more memory than compiled alternatives
- **Less Performance**: Not as fast as compiled frameworks like Rust's Axum

### Alternatives Considered:
- **Node.js + Fastify**: Higher performance but smaller ecosystem and community
- **Deno**: Modern runtime but less mature ecosystem and limited chess library compatibility
- **Rust + Axum**: Better performance but higher complexity and learning curve

## Consequences

### Positive:
- Rapid development and deployment
- Easy integration with chess.js and other JavaScript libraries
- Simple static file serving for cached responses
- Excellent middleware ecosystem for caching and versioning
- Easy to implement auto-discovery patterns
- Great developer experience with hot reloading and debugging

### Negative:
- Performance limitations for very high traffic (beyond 100 req/sec)
- Single-threaded nature may require worker threads for complex calculations
- Memory overhead compared to compiled alternatives

### Risks:
- May need optimization for high-traffic scenarios
- Single point of failure if not properly configured
- Need to implement proper error handling and logging

## Implementation Notes:
- Use Express.js with TypeScript for type safety
- Implement static file middleware for cached FEN responses
- Add middleware for version checking and cache invalidation
- Consider worker threads for CPU-intensive metric calculations
- Implement proper error handling and logging middleware
- Use compression middleware for JSON responses
- Add rate limiting middleware for API protection
