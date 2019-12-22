/**
 * Board - class that represents the board of the game
 */
class Board {
    /**
     * Constructor of the class
     * @param {GameOrchestrator} orchestrator - reference to the game orchestrator
     * @param {TileTemplate} tileTemplate - reference to the current tile template
     */
    constructor(orchestrator, tileTemplate) {
        this.orchestrator = orchestrator;
        this.tileTemplate = tileTemplate;
        this.boardCells = this.generateBoardCells(); // individual board cells that interact with mouse events
    }


    /**
     * Function that adds a microbe to a tile
     * @param {Microbe} microbe - Reference to the microbe
     * @param {int} tileID - Unique ID of the tile
     */
    addMicrobeToTile(microbe, tileID) {

    }


    getTileByCoords() {
        
    }

    /**
     * Function that generates the individual board cells that will interact with mouse events
     */
    generateBoardCells() {
        let curID = 1;

    }
}