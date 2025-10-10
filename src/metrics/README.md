# Metrics System

This directory contains the auto-discoverable chessmetrics that analyze various aspects of chess positions.

## Overview

The metrics system is designed to be extensible and modular. Each metric is self-contained and can be easily added, modified, or removed without affecting other metrics.

## Metric Types

### Boolean Metrics
Return true/false values for specific conditions.

**Examples:**
- `isPinned`: Is a piece pinned?
- `isHanging`: Is a piece undefended?
- `canCastle`: Can a player castle?

### Numerical Metrics
Return numeric values for quantitative analysis.

**Examples:**
- `numberOfAttackers`: How many pieces attack a square?
- `freedom`: How many legal moves does a piece have?
- `control`: How many squares does a player control?

### Enum Metrics
Return predefined string values.

**Examples:**
- `color`: "white" or "black"
- `type`: "pawn", "rook", "bishop", "knight", "queen", "king"
- `squareColor`: "light" or "dark"
