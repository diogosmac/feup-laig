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

        var centerX, centerY;
        var vertexX, vertexY, vertexZ;
        var normal = vec3.create(0, 0, 0);

        for (var loop = 0; loop <= this.loops; loop++) {

            for (var slice = 0; slice <= this.slices; slice++) {

                var u = (slice / this.slices) * Math.PI * 2;
                var v = (loop / this.loops) * Math.PI * 2;

                vertexX = (this.outer + this.inner * Math.cos(v)) * Math.cos(u);
                vertexY = (this.outer + this.inner * Math.cos(v)) * Math.sin(u);
                vertexZ = this.inner * Math.sin(v);

                this.vertices.push(vertexX, vertexY, vertexZ);

                centerX = this.outer * Math.cos(u);
                centerY = this.outer * Math.sin(u);
                normal.x = vertexX - centerX;
                normal.y = vertexY - centerY;
                normal.z = vertexZ;
    
                vec3.normalize(normal, normal);

                this.normals.push(normal.x, normal.y, normal.z);
    
                this.texCoords.push(slice / this.inner, loop / this.outer);
            }

        }


        for (var loop = 1; loop <= this.loops; loop++) {
            
            for (var slice = 1; slice <= this.slices; slice++) {

                var vertex1 = ( this.slices + 1 ) * loop + slice - 1;
                var vertex2 = ( this.slices + 1 ) * ( loop - 1 ) + slice - 1;
                var vertex3 = ( this.slices + 1 ) * ( loop - 1 ) + slice;
                var vertex4 = ( this.slices + 1 ) * loop + slice;

                this.indices.push(vertex1, vertex2, vertex4);
                this.indices.push(vertex2, vertex3, vertex4);

            }

        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}