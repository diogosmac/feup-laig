/**
 * SideBoardTemplate - class that represents the geometry and look of a microbe
 */
class SideBoardTemplate {
    /**
     * Constructor of the class
     * @param {CGFobject} sideBoardGeometry - object that represents a side board
     * @param {CGFappearance} sideBoardMat - material for the first type of side board
     * @param {CGFtexture} sideBoardTexture - texture for the first type of side board
     */
    constructor(sideBoardGeometry, sideBoardMat, sideBoardTexture) {
        this.sideBoardGeometry = sideBoardGeometry;
        this.sideBoardMat = sideBoardMat;
        this.sideBoardTexture = sideBoardTexture;
    }
}
