# 🚀 Chessmetrics Userscript Installation Guide

## 📋 Prerequisites

1. **Install a userscript manager**:
   - **Tampermonkey** (Chrome, Firefox, Edge, Safari) - [Download](https://www.tampermonkey.net/)
   - **Greasemonkey** (Firefox) - [Download](https://www.greasespot.net/)
   - **Violentmonkey** (Chrome, Firefox, Edge) - [Download](https://violentmonkey.github.io/)

## 🎯 Installation Steps

### Method 1: Direct Installation (Recommended)

1. **Open the userscript file**:
   - Navigate to: `userscript/dist/chessmetrics.user.js`
   - Open it in a text editor or browser

2. **Copy the entire content**:
   - Select all content (Ctrl+A / Cmd+A)
   - Copy (Ctrl+C / Cmd+C)

3. **Install in Tampermonkey**:
   - Click the Tampermonkey extension icon
   - Select "Create a new script"
   - Delete the default content
   - Paste the copied content
   - Save (Ctrl+S / Cmd+S)

4. **Verify installation**:
   - Go to any Lichess page (analysis, game, puzzle)
   - Open browser console (F12)
   - You should see: `♟️ Chessmetrics userscript loaded!`

### Method 2: File Installation

1. **Download the userscript**:
   - Save `userscript/dist/chessmetrics.user.js` to your computer

2. **Install via Tampermonkey**:
   - Open Tampermonkey dashboard
   - Click "Utilities" tab
   - Click "Choose file" and select `chessmetrics.user.js`
   - Click "Install"

## 🎮 Usage

Once installed, the userscript will automatically load on Lichess pages. You can use it via the browser console:

### Basic Commands

```javascript
// Detect current board position
window.chessmetrics.detectBoard()

// Analyze a specific position
window.chessmetrics.standard.fen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")

// Debug page information
window.chessmetrics.debugPage()
```

### Move Tracking (New Feature!)

```javascript
// Start automatic move tracking
window.chessmetrics.startMoveTracking()

// Navigate through moves - analysis happens automatically!
// Use arrows, click moves, use navigation buttons

// Stop tracking
window.chessmetrics.stopMoveTracking()

// Check if tracking is active
window.chessmetrics.isMoveTrackingActive()
```

### Debug Mode Control

```javascript
// Enable debug logging (shows detailed console output)
window.chessmetrics.setDebugMode(true)

// Disable debug logging (silent operation)
window.chessmetrics.setDebugMode(false)

// Check current debug status
window.chessmetrics.isDebugMode()
```

## 🎯 What Happens When You Navigate

Once you start move tracking, every time you navigate to a different move on Lichess, you'll see output like this in the console (when debug mode is enabled):

```
🎯 MoveTracker: Position changed to ply 15
📊 Analysis for ply 15: {version: "1.0.0", fen: "...", ...}
🎯 Key Metrics:
  - Turn: White
  - Total Pieces: 16
  - Hanging Pieces: 0
  - Average Freedom: 3.25
  - Attacked Squares: 12/64
```

**Note**: By default, debug mode is **disabled** for a clean console experience. Enable it with `window.chessmetrics.setDebugMode(true)` to see detailed logging.

## 🔧 Supported Navigation Methods

The move tracker automatically detects navigation through:

- ✅ **Keyboard**: Arrow keys (← → ↑ ↓), Space, j/k, Home/End
- ✅ **Mouse**: Clicking moves in the move list
- ✅ **UI Buttons**: Navigation buttons (<< < > >>)
- ✅ **Replay Mode**: Automatic move playback

## 🐛 Troubleshooting

### Userscript Not Loading

1. **Check Tampermonkey is enabled**:
   - Click Tampermonkey icon
   - Ensure "Enabled" is checked

2. **Check page matches**:
   - Userscript only works on `lichess.org/*` and `chess.com/*`
   - Make sure you're on a supported page

3. **Check console for errors**:
   - Open browser console (F12)
   - Look for error messages

### Move Tracking Not Working

1. **Verify userscript is loaded**:
   ```javascript
   console.log(typeof window.chessmetrics) // Should be "object"
   ```

2. **Check if tracking is active**:
   ```javascript
   window.chessmetrics.isMoveTrackingActive() // Should be true/false
   ```

3. **Try manual detection**:
   ```javascript
   window.chessmetrics.detectBoard() // Should return board info
   ```

## 📁 File Structure

```
userscript/
├── dist/
│   └── chessmetrics.user.js    # ← Install this file
├── src/
│   ├── main.ts                 # Main userscript entry
│   ├── api.ts                  # Public API
│   └── sites/
│       └── lichess/            # Lichess integration
└── test-move-tracking.html     # Test page (optional)
```

## 🔄 Updates

To update the userscript:

1. **Download the new version** of `chessmetrics.user.js`
2. **Open Tampermonkey dashboard**
3. **Find "Chessmetrics"** in the script list
4. **Click the edit icon**
5. **Replace the content** with the new version
6. **Save** (Ctrl+S / Cmd+S)

## 🆘 Support

If you encounter issues:

1. **Check the console** for error messages
2. **Verify the userscript is installed** correctly
3. **Try on different Lichess pages** (analysis, game, puzzle)
4. **Check Tampermonkey settings** and permissions

The userscript should work on all modern browsers with Tampermonkey/Greasemonkey installed.
