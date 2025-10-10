# ADR-003: Caching Strategy - File System Caching

## Status
Accepted

## Context
We need to choose a caching strategy for the chessmetrics server that:
- Avoids generating the same JSON response twice for identical FEN positions
- Supports version-based cache invalidation when new metrics are added
- Handles 100 requests per second efficiently
- Provides fast response times for cached FEN positions
- Works well with static file serving
- Supports easy cache cleanup during version updates

## Decision
We will use **File System Caching** as the primary caching strategy.

## Rationale

### Pros:
- **Simple Implementation**: Direct file system operations, no external dependencies
- **Perfect for Static Content**: FEN responses are immutable and ideal for static file serving
- **Version-based Invalidation**: Easy to implement - just delete cache directory when version changes
- **CDN Compatible**: Static files work perfectly with CDNs for global distribution
- **Express Integration**: Seamless integration with Express.js static middleware
- **Cost Effective**: No additional infrastructure or service costs
- **Easy Debugging**: Can inspect cached files directly
- **Atomic Operations**: File system operations are atomic, preventing race conditions
- **Backup Friendly**: Cached files can be easily backed up and restored

### Cons:
- **Disk I/O Bottleneck**: File system operations may become bottleneck at very high scale
- **Single Server Limitation**: Cache not shared across multiple server instances
- **Disk Space Usage**: Requires disk space for cached responses
- **No Advanced Features**: No built-in expiration, compression, or advanced caching features

### Alternatives Considered:
- **Redis**: Excellent performance but adds infrastructure complexity and memory usage
- **Memcached**: Good performance but no persistence and additional infrastructure
- **CDN Only**: Global distribution but less control over cache invalidation
- **In-Memory Caching**: Fast but limited by server memory and not persistent

## Consequences

### Positive:
- Simple deployment and maintenance
- No external service dependencies
- Easy to implement and debug
- Perfect fit for immutable FEN responses
- Cost-effective solution
- Easy integration with Express static middleware
- Simple version-based cache invalidation

### Negative:
- May become bottleneck at very high traffic (1000+ req/sec)
- Not suitable for distributed/multi-server deployments
- Disk space management required
- No built-in cache compression or optimization

### Risks:
- Disk I/O may become bottleneck under high load
- Single point of failure if disk becomes full
- Need to implement proper disk space monitoring
- Cache directory cleanup required during deployments

## Implementation Notes:
- Store cached responses as JSON files in organized directory structure
- Use FEN string as filename (with proper sanitization)
- Implement version-based cache invalidation by deleting cache directory
- Add disk space monitoring and cleanup procedures
- Consider file compression for large cached responses
- Implement proper error handling for disk I/O operations
- Use Express static middleware for serving cached files
- Consider implementing cache warming strategies for popular FEN positions

## Cache Structure:
```
cache/
├── v1.0.0/
│   ├── rnbqkbnr-pppppppp-8-8-8-8-PPPPPPPP-RNBQKBNR-w-KQkq--0-1.json
│   ├── rnbqkbnr-pppppppp-8-8-4P3-8-PPPP1PPP-RNBQKBNR-b-KQkq--0-1.json
│   └── ...
└── v1.1.0/
    ├── rnbqkbnr-pppppppp-8-8-8-8-PPPPPPPP-RNBQKBNR-w-KQkq--0-1.json
    └── ...
```
