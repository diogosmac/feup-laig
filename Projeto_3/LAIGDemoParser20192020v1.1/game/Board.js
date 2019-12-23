/**
 * Board - class that represents the board of the game
 */
class Board {
    /**
     * Constructor of the class
     * @param {GameOrchestrator} orchestrator - reference to the game orchestrator
     * @param {BoardTemplate} boardTemplate - reference to the current board template
     */
    constructor(orchestrator, boardTemplate) {
        this.orchestrator = orchestrator;
        this.boardTemplate = boardTemplate;
        this.initialTileX = 1.575; 
        this.initialTileY = 1.575;
        this.tileOffset = 0.55; // tile side + space between 2 tiles = 0.5 + 0.05 = 0.55 
        this.boardTiles = this.generateBoardTiles(); // individual board tiles that interact with mouse events
    }


    /**
     * Method to receive a new template from the XML file
     * @param {BoardTemplate} newTemplate - new board template
     */
    loadTemplate(newTemplate) {
        this.boardTemplate = newTemplate;
    }


    /**
     * Function that adds a microbe to a tile
     * @param {Microbe} microbe - Reference to the microbe
     * @param {int} tileID - Unique ID of the tile
     */
    addMicrobeToTile(microbe, tileID) {

    }


    /**
     * Method that selects/deselects a tile after it's been picked
     * @param {int} tileID - unique tile ID of the picked tile
     */
    toggleTile(tileID) {
        this.boardTiles[tileID].selected = this.boardTiles[tileID].selected ? false : true;
    }


    /**
     * Method that returns the tile that is on the line and column specified in the arguments
     * @param {int} line - tile line
     * @param {int} column - tile column
     * @return the tile in those coordinates
     */
    getTileByCoords(line, column) {
        let tileID = 7 * line + column;
        return this.boardTiles[tileID];
    }


    /**
     * Function that generates the individual board tiles that will interact with mouse events
     * @return Array with all the tiles
     */
    generateBoardTiles() {
        let curTileID = 1;
        let tilesArray = [];
        let y = this.initialTileY;
        for(let line = 1; line <= 7; line++) {
            let x = this.initialTileX;
            for(let column = 1; column <= 7; column++) {
                tilesArray.push(new Tile(this.orchestrator, curTileID, line, column, x, y, this, null));
                curTileID++;
                x -= this.tileOffset;
            }
            y -= this.tileOffset;
        }

        return tilesArray;
    }


    /**
     * Display method for the game board and its tiles
     */
    display() {
        let scene = this.orchestrator.scene;

        scene.pushMatrix();
        this.boardTemplate.boardGeometry.display();
        scene.popMatrix();
    }
}