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
     */
    constructor(orchestrator, id, line, column, x, y, gameboard) {
        this.orchestrator = orchestrator;
        this.id = id;
        this.gameboard = gameboard;
        this.line = line;
        this.column = column;
        this.x = x;
        this.y = y;
        this.microbe = null;
        this.selected = false;
        this.highlighted = false;
        this.animation = null;
    }


    /**
     * Method to load a new template for the display of the tile
     * @param {CGFappearance} tileMaterial - material to be used in the tile display
     * @param {CGFtexture} tileTexture - texture to be used in the tile display
     */
    loadTemplate(tileMaterial, tileTexture) {
        this.tileMaterial = tileMaterial;
        this.tileTexture = tileTexture;
    }


    /**
     * Method that adds a microbe to a tile
     * @param {Microbe} microbe - Reference to the microbe
     */
    addMicrobeToTile(microbe) {
        this.microbe = microbe;
        microbe.assignMicrobeToTile(this);
    }

	/**
     * Method that removes a microbe from a tile
     */
    removeMicrobeFromTile() {
        this.microbe = null;
    }
}
