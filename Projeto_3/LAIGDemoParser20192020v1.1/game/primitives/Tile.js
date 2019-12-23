/**
 * Tile - Class that represents a board tile
 */
class Tile {
    /**
     * Constructor of the class
     * @param {GameOrchestrator} orchestrator - reference to the game orchestrator
     * @param {int} id - Unique id to identify the tile when doing picking operations
     * @param {int} line - The line of the tile
     * @param {int} column - The column of the tile
     * @param {int} x - the x coordinate offset of the tile
     * @param {int} y - the y coordinate offset of the tile
     * @param {Board} board - Reference to the game board object
     * @param {Microbe} microbe - Reference to the microbe that is on this tile (if any)
     */
    constructor(orchestrator, id, line, column, x, y, gameboard, microbe = null) {
        this.orchestrator = orchestrator;
        this.id = id;
        this.gameboard = gameboard;
        this.line = line;
        this.column = column;
        this.x = x;
        this.y = y;
        this.microbe = microbe;
        this.selected = false;
        this.highlighted = false;
    }


    /**
     * Function that sets (or unsets) the microbe that is on this tile
     * @param {Microbe} microbe - Reference to the new microbe (if any)
     */
    setMicrobe(microbe) {
        this.microbe = microbe;
    }
}