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
     * Method that generates a leaping animation, for when the microbe on this tile moves
     */
    leapAnimation(newTile) {
        if (this.microbe != null) {

            let transX = newTile.x - this.x;
			let transZ = newTile.y - this.y;

            let raise = new MyKeyframe([0, 2, 0], [0, 0, 0], [1, 1, 1], this.orchestrator.time + 1.2);
            let hold = new MyKeyframe([0, 2, 0], [0, 0, 0], [1, 1, 1], this.orchestrator.time + 1.4);
            let strike = new MyKeyframe([transX, 0, transZ], [0, 0, 0], [1, 1, 1], this.orchestrator.time + 1.5);

            let keyframes = [raise, hold, strike];

			this.microbe.animation = new KeyframeAnimation(this.orchestrator.scene, keyframes);
        }
	}
	
	/**
	 * Method that generates a spinning animation, with a change of color
	 */
	convertAnimation() {
		if (this.microbe != null) {
			let jump = new MyKeyframe([0, 2, 0], [0, 0, 0], [1, 1, 1], this.orchestrator.time + 0.4);
			let expand = new MyKeyframe([0, 2, 0], [0, Math.PI / 2, 0], [3, 1, 3], this.orchestrator.time + 0.7);
			let twirl = new MyKeyframe([0, 1.8, 0], [0, Math.PI, 0], [1, 1, 1], this.orchestrator.time + 1);
			let restore = new MyKeyframe([0, 0, 0], [0, Math.PI * 4, 0], [1, 1, 1], this.orchestrator.time + 1.5);

			let keyframes = [jump, expand, twirl, restore];

			this.microbe.animation = new KeyframeAnimation(this.orchestrator.scene, keyframes);
		}
	}

    /**
     * Method that removes a microbe from a tile
     */
    removeMicrobeFromTile() {
        this.microbe = null;
    }
}
