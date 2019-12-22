/**
 * Tile - Class that represents a board tile
 */
class Tile {
    /**
     * Constructor of the class
     * @param {GameOrchestrator} orchestrator - reference to the game orchestrator
     * @param {int} id - Unique id to identify the tile when doing picking operations
     * @param {Board} board - Reference to the game board object
     * @param {Microbe} microbe - Reference to the microbe that is on this tile (if any)
     */
    constructor(orchestrator, id, gameboard, microbe = null) {
        this.orchestrator = orchestrator;
        this.id = id;
        this.gameboard = gameboard;
        this.microbe = microbe;
    }

    /**
     * Function that sets (or unsets) the microbe that is on this tile
     * @param {Microbe} microbe - Reference to the new microbe (if any)
     */
    setMicrobe(microbe) {
        this.microbe = microbe;
    }

    /**
     * Display method of the tile object
     * @param {int} ls - Texture length in S
     * @param {int} lt - Texture length in T
     */
    display(ls, lt) {
    }
}