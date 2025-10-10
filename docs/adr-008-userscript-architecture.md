# ADR-008: Userscript Architecture

## Status

**Accepted**

## Context

We need to create a browser userscript that provides chess position analysis and metrics for chess.com and lichess.org websites. The userscript should:

- Activate on chess.com and lichess.org websites
- Create a global `chessmetrics` JavaScript object
- Provide `chessmetrics.standard.fen(fen)` function that returns the same JSON object as the API
- Reuse metrics calculation logic from the main application
- Be distributed as a single file
- Handle external dependencies (chess.js library)

## Decision

We will implement a **build-time code copying approach** (Option B) with the following architecture:

### 1. Code Sharing Strategy

**Build-time Copying**: Copy shared code from the main application to the userscript during build process.

- **Shared Code**: `src/metrics/`, `src/core/`, `src/types/` copied to `userscript/src/shared/`
- **Build Process**: Webpack bundles everything into a single userscript file
- **Dependencies**: chess.js loaded externally via CDN using `@require`

### 2. Project Structure

```
chessmetrics/
├── src/                          # Main application
│   ├── api/
│   ├── core/
│   ├── metrics/
│   └── types/
├── userscript/                   # Userscript module
│   ├── src/
│   │   ├── main.ts              # Main userscript entry point
│   │   ├── api.ts               # chessmetrics.standard.fen() API
│   │   ├── types.ts             # TypeScript type definitions
│   │   ├── sites/               # Site-specific integrations
│   │   ├── shared/              # Copied from main app (build-time)
│   │   └── utils/               # Utility functions
│   ├── build/
│   │   └── webpack.config.js    # Webpack configuration
│   ├── tests/                   # Test files
│   ├── dist/
│   │   └── chessmetrics.user.js # Generated userscript file
│   └── README.md
└── package.json                 # Updated with userscript scripts
```

### 3. Build System

**Webpack Configuration**:
- **Entry**: `userscript/src/main.ts`
- **Output**: Single file `chessmetrics.user.js`
- **Minification**: TerserPlugin with custom comment preservation
- **External Dependencies**: chess.js loaded via `@require`
- **Target**: Web browser environment

**NPM Scripts**:
```json
{
  "build:userscript": "webpack --config userscript/build/webpack.config.js",
  "dev:userscript": "webpack --config userscript/build/webpack.config.js --watch"
}
```

### 4. Userscript Metadata

```javascript
// ==UserScript==
// @name         Chess Metrics
// @namespace    https://github.com/ruslanbes/chessmetrics
// @version      1.0.0
// @description  Chess position analysis and metrics for chess.com and lichess.org
// @author       Chess Metrics Team
// @match        https://www.chess.com/*
// @match        https://lichess.org/*
// @grant        none
// @require      https://unpkg.com/chess.js@1.4.0/chess.min.js
// ==/UserScript==
```

### 5. Global API Design

```javascript
window.chessmetrics = {
  standard: {
    fen: (fenString) => {
      // Returns same object as API endpoint
      return {
        version: "1.0.0",
        fen: fenString,
        gameType: "standard",
        pieces: [...],
        players: {
          white: { isMyTurn: true },
          black: { isMyTurn: false }
        }
      }
    }
  }
}
```

### 6. Dependency Management

**chess.js Library**:
- **Loading Method**: External CDN via `@require` directive
- **CDN Source**: `https://unpkg.com/chess.js@1.4.0/dist/cjs/chess.js`
- **Fallback**: Dynamic loading from CDN if `@require` fails
- **Bundle Size**: Not included in userscript bundle

**Internal Dependencies**:
- **Shared Code**: Copied during build process
- **TypeScript**: Compiled to JavaScript
- **Bundling**: Webpack handles module resolution

### 7. Build Process Flow

```bash
npm run build:userscript
├── Copy shared code to userscript/src/shared/
├── Webpack bundling (TypeScript → JavaScript)
├── TerserPlugin minification (preserve userscript metadata)
├── Output to userscript/dist/chessmetrics.user.js
└── Ready for distribution
```

## Rationale

### Why Build-time Copying?

**Pros**:
- ✅ **Simple setup** - No additional repositories or packages
- ✅ **Fast development** - Changes in main app immediately available
- ✅ **No versioning complexity** - Always uses latest code
- ✅ **Easy debugging** - All code in one place
- ✅ **No build dependencies** - Self-contained build process
- ✅ **Perfect for MVP** - Quick to implement and iterate

**Cons**:
- ❌ **Code duplication** - Same code exists in multiple places
- ❌ **Build complexity** - Need to manage copying and syncing
- ❌ **Potential inconsistencies** - Risk of copied code getting out of sync
- ❌ **Bundle size** - Userscript includes all shared code

### Why Not Shared NPM Package?

**Rejected because**:
- ❌ **Complex setup** - Multiple packages, build processes
- ❌ **Development friction** - Need to publish/install for changes
- ❌ **Version management** - Need to manage package versions
- ❌ **Build dependencies** - More complex CI/CD
- ❌ **Overhead** - Overkill for MVP

### Why Webpack?

**Chosen because**:
- ✅ **TypeScript support** - Built-in TypeScript compilation
- ✅ **Module bundling** - Combines multiple files into one
- ✅ **Minification** - Reduces file size
- ✅ **Comment preservation** - Custom TerserPlugin configuration
- ✅ **External dependencies** - Handles chess.js as external
- ✅ **Mature ecosystem** - Well-documented and stable

### Why External chess.js?

**Chosen because**:
- ✅ **Bundle size** - Reduces userscript file size
- ✅ **CDN reliability** - unpkg.com is highly available
- ✅ **Version control** - Can specify exact version
- ✅ **Caching** - Browser can cache chess.js across sites
- ✅ **Fallback support** - Can implement dynamic loading if needed

## Consequences

### Positive

- **Rapid Development**: Quick iteration and testing
- **Code Reuse**: Shared logic between API and userscript
- **Single File Distribution**: Easy installation and management
- **Browser Compatibility**: Works with all major userscript managers
- **Performance**: Minified and optimized code
- **Maintainability**: Clear separation of concerns

### Negative

- **Build Complexity**: Need to manage code copying and syncing
- **Bundle Size**: Includes all shared code in userscript
- **Potential Sync Issues**: Risk of copied code getting out of sync
- **External Dependency**: Relies on CDN for chess.js
- **Development Overhead**: Need to rebuild userscript for changes

### Risks

- **Code Drift**: Shared code could become inconsistent
- **CDN Failure**: chess.js CDN could become unavailable
- **Build Failures**: Webpack configuration could break
- **Version Mismatches**: chess.js version conflicts

### Mitigations

- **Automated Testing**: Test both main app and userscript
- **Build Validation**: Verify userscript builds successfully
- **CDN Fallback**: Implement dynamic loading if CDN fails
- **Version Pinning**: Pin exact chess.js version
- **Documentation**: Clear build and development instructions

## Implementation Status

### Completed

- ✅ **Project Structure**: Created userscript directory structure
- ✅ **Webpack Configuration**: Set up bundling with metadata preservation
- ✅ **Userscript Metadata**: Complete header with all required fields
- ✅ **Global API**: `window.chessmetrics.standard.fen()` function
- ✅ **Build Scripts**: NPM scripts for building and development
- ✅ **TypeScript Configuration**: Proper compilation settings
- ✅ **Documentation**: README and usage instructions

### Pending

- ⏳ **Code Copying**: Implement build-time copying of shared code
- ⏳ **Real Metrics**: Replace placeholder with actual metrics calculation
- ⏳ **Site Integration**: Add chess.com and lichess.org specific code
- ⏳ **Testing**: Add unit and integration tests
- ⏳ **Error Handling**: Implement proper error handling and validation

## Future Considerations

### Migration Path

**Phase 1: MVP with Build-time Copying**
- Current implementation
- Fast development and iteration

**Phase 2: Extract to Shared Package**
- Move to Option C (shared NPM package)
- When userscript becomes complex
- When multiple consumers need core logic

**Phase 3: Independent Repositories**
- Separate repositories for core and userscript
- Independent versioning and development
- Community contributions and distribution

### Potential Improvements

- **Auto-updates**: Version checking and update notifications
- **Settings UI**: User preferences and configuration
- **Performance**: Lazy loading and caching
- **Analytics**: Usage tracking (optional)
- **Multiple variants**: Support for atomic, crazyhouse, etc.

## References

- [Userscript Development Best Practices](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts)
- [Webpack Configuration](https://webpack.js.org/configuration/)
- [TerserPlugin Documentation](https://webpack.js.org/plugins/terser-webpack-plugin/)
- [Chess.js Library](https://github.com/jhlywa/chess.js)
- [Tampermonkey Documentation](https://www.tampermonkey.net/documentation.php)
