/**
 * BoardTemplate - class that represents the geometry and look of the game board and tiles
 */
class BoardTemplate {
    /**
     * Constructor of the class
     * @param {CGFobject} boardGeometry - object that represents the board
     * @param {CGFappearance} boardMaterial - material of the board
     * @param {CGFtexture} boardTexture - texture of the board
     * @param {CGFobject} tileGeometry - object that represents a tile
     * @param {CGFappearance} tile1Mat - material for the first type of tile
     * @param {CGFtexture} tile1Texture - texture for the first type of tile
     * @param {CGFappearance} tile2Mat - material for the second type of tile
     * @param {CGFtexture} tile2Texture - texture for the second type of tile
     * @param {CGFappearance} selectedTileMat - material to be used by a selected tile (after the user clicks on it)
     * @param {CGFappearance} highlightedTileMat - material to be used by a highlighted tile (to symbolize the valid tiles for the selected microbe)
     */
    constructor(boardGeometry, boardMaterial, boardTexture, tileGeometry, tile1Mat, tile1Texture, tile2Mat, tile2Texture, selectedTileMat, highlightedTileMat) {
        this.boardGeometry = boardGeometry;
        this.boardMaterial = boardMaterial;
        this.boardTexture = boardTexture;
        this.tileGeometry = tileGeometry;
        this.tile1Mat = tile1Mat;
        this.tile1Texture = tile1Texture;
        this.tile2Mat = tile2Mat;
        this.tile2Texture = tile2Texture;
        this.selectedTileMat = selectedTileMat;
        this.highlightedTileMat = highlightedTileMat;
    }
}