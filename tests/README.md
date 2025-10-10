# Test Suite

This directory contains the test infrastructure and shared test utilities for the Chessmetrics project.

## Test Structure

### Unit Tests
- **Location**: Co-located with source files (e.g., `src/metrics/player/isMyTurn.test.ts`)
- **Purpose**: Test individual functions and classes in isolation
- **Run**: `npm run test:unit`

### Integration Tests
- **Location**: `src/index.integration.test.ts`
- **Purpose**: Test the full API endpoints end-to-end
- **Run**: `npm run test:integration`

### Test Fixtures
- **Location**: `tests/fixtures/chess-positions.ts`
- **Purpose**: Shared chess positions and test data
- **Usage**: Import in both unit and integration tests

## Running Tests

```bash
# Run all tests
npm test

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Coverage

The project maintains high test coverage with:
- **Unit Tests**: Test individual metrics, chess board operations, and calculations
- **Integration Tests**: Test complete API endpoints with real HTTP requests
- **Edge Cases**: Test invalid inputs, error conditions, and boundary cases

## Test Data

### Chess Positions
The `tests/fixtures/chess-positions.ts` file contains:
- Standard chess positions (starting, after common moves)
- Edge cases (checkmate, stalemate, kings only)
- Invalid FENs for error testing

### Fixture Usage
```typescript
import { CHESS_POSITIONS, EDGE_CASES, INVALID_FENS } from '../tests/fixtures/chess-positions'

// Use in tests
const board = new ChessBoard(CHESS_POSITIONS.STARTING)
```

## Integration Test Features

The integration tests use Supertest to:
- Test real HTTP endpoints
- Validate request/response formats
- Test error handling
- Verify API behavior end-to-end

### Example Integration Test
```typescript
it('should analyze starting position correctly', async () => {
  const fen = encodeURIComponent(CHESS_POSITIONS.STARTING)
  
  const response = await request(app)
    .get(`/api/v1/standard/fen/${fen}`)
    .expect(200)

  expect(response.body).toMatchObject({
    version: '1.0.0',
    fen: CHESS_POSITIONS.STARTING,
    gameType: 'standard',
    players: {
      white: { isMyTurn: true },
      black: { isMyTurn: false }
    }
  })
})
```
