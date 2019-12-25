/**
 * MicrobeTemplate - class that represents the geometry and look of a microbe
 */
class MicrobeTemplate {
    /**
     * Constructor of the class
     * @param {CGFOBJModel} microbeGeometry - object that represents a microbe
     * @param {CGFappearance} microbeMat - material to be used in the display of the microbe
     * @param {CGFtexture} microbeTexture - texture to be applied to the microbe 
     * @param {float} microbeScale - scale factor to be applied in the display of the microbe
     */
    constructor(microbeGeometry, microbeMat, microbeTexture, microbeScale) {
        this.microbeGeometry = microbeGeometry;
        this.microbeMat = microbeMat;
        this.microbeTexture = microbeTexture;
        this.microbeScale = microbeScale;
    }
}