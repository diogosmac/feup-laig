/**
 * Board - class that represents the board of the game
 */
class Board extends CGFobject {
    /**
     * Constructor of the board
     */
    constructor(scene) {
        this.scene = scene;
        this.board = new Plane(scene, "board", 30, 30); // board that is going to be displayed to the user
        this.boardCells = this.generateBoardCells(); // individual board cells that interact with mouse events
        // this.highlightCell = 
    }


    /**
     * Function that generates the individual board cells that will interact with mouse events
     */
    generateBoardCells() {

    }
}