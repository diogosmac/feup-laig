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

        var sliceValue = this.slices * Math.PI * 2;
        var loopValue = this.loops * Math.PI * 2;

        var center = vec3.create();
        var vertex = vec3.create();
        var normal = vec3.create();

        for (var loop = 0; loop <= this.loops; loop++) {

            for (var slice = 0; slice <= this.slices; slice++) {

                var u = slice / sliceValue;
                var v = loop / loopValue;

                vertex[0] = (this.outer + this.inner * Math.cos(v)) * Math.cos(u);
                vertex[1] = (this.outer + this.inner * Math.cos(v)) * Math.sin(u);
                vertex[2] = this.inner * Math.sin(v);

                this.vertices.push(vertex[0], vertex[1], vertex[2]);

                center[0] = this.outer * Math.cos(u);
                center[1] = this.outer * Math.sin(u);
                normal[0] = vertex[0] - center[0];
                normal[1] = vertex[1] - center[1];
                normal[2] = vertex[2] // - center[2];
    
                vec3.normalize(normal, normal);

                this.normals.push(normal[0], normal[1], normal[2]);
    
                this.texCoords.push(slice / this.inner);
                this.texCoords.push(loop / this.outer);

            }

        }


        for (var loop = 0; loop < this.loops; loop++) {
            
            for (var slice = 0; slice < this.slices; slice++) {

                var vertex1 = ( this.slices + 1 ) * loop + slice - 1;
                var vertex2 = ( this.slices + 1 ) * ( loop - 1 ) + slice - 1;
                var vertex3 = ( this.slices + 1 ) * ( loop - 1 ) + slice;
                var vertex4 = ( this.slices + 1 ) * loop + slice;
            }

            this.indices.push(vertex1, vertex2, vertex4);
            this.indices.push(vertex2, vertex3, vertex4);

        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}