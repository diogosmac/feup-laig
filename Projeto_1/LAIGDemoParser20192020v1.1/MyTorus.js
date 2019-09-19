/**
 * MyTorus
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - ID of the object
 * @param inner - Inner radius of the torus
 * @param outer - Outer radius of the torus
 * @param slices - Number of desired slices
 * @param loops - Number of desired loops
 */
class MyTorus extends CGFobject {

    constructor(scene, id, inner, outer, slices, loops) {
        super(scene);
        this.id = id;
        this.inner = inner;
        this.outer = outer;
        this.slices = slices;
        this.loops = loops;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.texCoords = [];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}