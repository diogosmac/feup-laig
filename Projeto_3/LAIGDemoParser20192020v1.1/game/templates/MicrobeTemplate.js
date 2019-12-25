/**
 * MicrobeTemplate - class that represents the geometry and look of a microbe
 */
class MicrobeTemplate {
    /**
     * Constructor of the class
     * @param {CGFobject} microbeGeometry - object that represents a microbe
     * @param {CGFappearance} microbeMaterial - material to be used in the display of the microbe
     * @param {CGFtexture} microbeTexture - texture to be applied to the microbe
     */
    constructor(microbeGeometry, microbeMaterial, microbeTexture) {
        this.microbeGeometry = microbeGeometry;
        this.microbeMaterial = microbeMaterial;
        this.microbeTexture = microbeTexture;
    }
}