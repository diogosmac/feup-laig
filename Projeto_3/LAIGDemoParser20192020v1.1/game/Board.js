/**
 * Board - class that represents the board of the game
 */
class Board {
    /**
     * Constructor of the class
     * @param {XMLScene} scene - Reference to the scene object
     */
    constructor(scene, tile1, tile2, selectedTile) {
        this.scene = scene;
        this.board = new Plane(scene, "board", 30, 30); // board that is going to be displayed to the user
        this.boardCells = this.generateBoardCells(); // individual board cells that interact with mouse events
        // this.highlightCell = 
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