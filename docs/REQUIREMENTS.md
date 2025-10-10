# Chessmetrics

## Description

Chessmetrics is a web server that receives HTTP requests with chess position in a FEN format and returns a json object that describes the board at that moment with various calculated metrics.

Clients, who will integrate with us. They will call our service to augment the position with new data and make it more interesting to watch the game:

- Lichess
- Chess.com
- Chess engines
- Any other chess sites (Chessable etc.)

Metrics can be:

- boolean. E.g. `isPinned` - tells if the piece is pinned
- numerical. E.g. `numberOfAttackers` - tells how many enemy pieces attack the selected piece.
- string (enumeration). E.g. piece color, piece type or the square coordinates

## Data structures

Following data structures must be created and included in the json response:

- **Piece.** Represents the piece on the board. Metrics: `color` (white/black), `isAttacked`, `isHanging`, `type` (enum rook/bishop/knight/ etc.), `numberOfAttackers`, `freedom` (how many valid moves one can make with this piece).
- **Square**. A square on the board. Metrics: `color` (dark/light), `file` (a-h), `rank` (1-8), `occupied` (bool), `numberOfWhiteAttackers`, `numberOfBlackAttackers`
- **Player.** Represents a player. Metrics: `isMyTurn` (whether its their turn now), `kingFreedom` (how many valid moves their king can do), `control` (how many squares are controlled), `canCastleLong`, `canCastleShort`. 


Additionally each json should have these fields on the top-level:
- `version`: version of the app that generated this json
- `fen`: FEN String from the request
 
## Architectural requirements
 
### Development 

- The project will be open-source and the core will be published. Anyone should be able to add more metrics or fix existing ones.
- Metrics could call each other for their calculations. E.g. `Player.kingFreedom()` could be implemented as a call to `Player.King.freedom()`. We should not calculate this value twice. We need to detect call loops too.
- Make implementing new metrics possible. Ideally make it so that every metric is a separate folder in the project, so that adding a metric is easy and isolated for an external contributor. There should be a minimum change in the shared codebase when adding a metric.  Metrics should be auto-discovered (convention over configuration)

### Performance

- Calculation of the full response for a single FEN is a computing-heavy task.
- Because of that we should avoid generating the same json twice. Ideally we should not even spin up the app if that fen was ever generated (using the same app version) and we should just give that static file back. Or, alternatively speaking, our web or app server should be configured to return static files and only bootstrap the app if it hasn't found the file. 
- When the new metrics are added, the app version is increased. Meaning that all generated jsons are obsolete and should be removed from cache. 
- During the new version rollout the clients can get HTTP errors when requesting the servcie. It's ok, the service will be in maintenance mode.
- Scalability may be an issue here. Plan for 100 requests per second. Keep in mind that among those 100 there may be requests for the same new fen and we should not start calculating it twice. E.g. if we have multiple replicas and a loadbalancer then we should not give two separate replicas the request for the same FEN or they will step on each other toes


### Maintainability

- In future we plan creating a browser userscript that should do the same metrics calculation inside the browser. Preferred technology stack is JavaScript/TypeScript or something that can be compiled to wasm