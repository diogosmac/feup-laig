/**
 * Board - class that represents the board of the game
 */
class Board {
    /**
     * Constructor of the class
     * @param {GameOrchestrator} orchestrator - reference to the game orchestrator
     */
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
        this.initialTileX = 1.95; 
        this.initialTileY = -1.95;
        this.tileOffset = 0.65; // tile side + space between 2 tiles = 0.6 + 0.05 = 0.65 
        this.boardTiles = this.generateBoardTiles(); // individual board tiles that interact with mouse events
    }


    /**
     * Method to receive a new template from the XML file
     * @param {BoardTemplate} newTemplate - new board template
     */
    loadTemplate(newTemplate) {
        this.boardTemplate = newTemplate;
        let currentTileMat = this.boardTemplate.tile1Mat;
        let currentTileTex = this.boardTemplate.tile1Texture;

        for(let i = 0; i < this.boardTiles.length; i++) {
            this.boardTiles[i].loadTemplate(currentTileMat, currentTileTex);
            currentTileMat = currentTileMat == this.boardTemplate.tile1Mat ? this.boardTemplate.tile2Mat : this.boardTemplate.tile1Mat;
            currentTileTex = currentTileTex == this.boardTemplate.tile1Texture ? this.boardTemplate.tile2Texture : this.boardTemplate.tile1Texture;
        }
    }


    /**
     * Method that adds a microbe to a tile
     * @param {Microbe} microbe - Reference to the microbe
     * @param {int} tileID - Unique ID of the tile
     */
    addMicrobeToTile(microbe, tileID) {
        this.boardTiles[tileID - 1].microbe = microbe;
    }


    /**
     * Method that removes a microbe from a tile
     * @param {int} tileID - Unique ID of the tile
     */
    removeMicrobeFromTile(tileID) {
        this.boardTiles[tileID - 1].microbe = null;
    }


    /**
     * Method that selects/deselects a tile after it's been picked
     * @param {int} tileID - unique tile ID of the picked tile
     */
    toggleTile(tileID) {
        this.boardTiles[tileID - 1].selected = this.boardTiles[tileID - 1].selected ? false : true;
    }


    /**
     * Method that resets all tiles to their standard state (no selected, no highlighted)
     */
    resetTiles() {
        for(let tile of this.boardTiles) {
            tile.selected = false;
            tile.highlighted = false;
        }
    }


    /**
     * Method that returns the tile that is on the line and column specified in the arguments
     * @param {int} line - tile line
     * @param {int} column - tile column
     * @return the tile in those coordinates
     */
    getTileByCoords(line, column) {
        let tileID = 7 * (line - 1) + column;
        return this.boardTiles[tileID - 1];
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
            y += this.tileOffset;
        }

        return tilesArray;
    }


    /**
     * Display method for the game board and its tiles
     */
    display() {
        let scene = this.orchestrator.scene;

        scene.pushMatrix();

        this.boardTemplate.boardMaterial.apply();
        if(this.boardTemplate.boardTexture != null)
            this.boardTemplate.boardTexture.bind();
        
        this.boardTemplate.boardGeometry.display();

        if(this.boardTemplate.boardTexture != null)
            this.boardTemplate.boardTexture.unbind();


        for(let i = 0; i < this.boardTiles.length; i++) {
            let tile = this.boardTiles[i];
            if(tile.selected)
                this.boardTemplate.selectedTileMat.apply();
            else
                tile.tileMaterial.apply();

            if(tile.tileTexture != null)
                tile.tileTexture.bind();

            scene.pushMatrix();
            scene.translate(tile.y, 0.051, tile.x);

            scene.registerForPick(tile.id, tile);
            this.boardTemplate.tileGeometry.display();
            if(tile.microbe != null)
                tile.microbe.display();

            scene.clearPickRegistration();
            scene.popMatrix();

            if(tile.tileTexture != null)
                tile.tileTexture.unbind();
        }

        scene.popMatrix();
    }
}