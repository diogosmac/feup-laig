/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - ID of the object
 * @param base -  Radius of the base (Z = 0)
 * @param top - Radius of the top (Z = height)
 * @param height - Height of the cylinder
 * @param slices - Number of slices
 * @param stacks - Number of stacks
 */
class MyCylinder extends CGFobject {
    constructor(scene, id, base, top, height, slices, stacks) {
        super(scene);
        this.id = id;
        this.base = base;
        this.top = top;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

        this.initBuffers();
    }

    initBuffers() {
    
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var normal = vec3.create(0,0,0);
        var vertexX, vertexY, vertexZ;

        // body
        for (var stack = 0; stack <= this.stacks; stack++) {

            var partRad = stack / this.stacks;
            var rad = partRad * (this.base - this.top) + this.top;

            for (var slice = 0; slice <= this.slices; slice++) {

                var partAng = slice / this.slices;
                var ang = partAng * Math.PI * 2;

                var sin = Math.sin(ang);
                var cos = Math.cos(ang);

                vertexX = rad * cos;
                vertexY = rad * sin;
                vertexZ = (1 - partRad) * this.height;

                this.vertices.push(vertexX, vertexY, vertexZ);

                normal.x = cos;
                normal.y = sin;
                normal.z = (this.base - this.top) / this.height;

                this.normals.push(normal.x, normal.y, normal.z);
                this.texCoords.push(partAng, partRad);

            }
        }

        for (var slice = 0; slice < this.slices; slice++) {
            for (var stack = 0; stack < this.stacks; stack++) {

                var v1 = stack * (this.slices + 1) + slice;
                var v2 = (stack + 1) * (this.slices + 1) + slice;
                var v3 = (stack + 1) * (this.slices + 1) + slice + 1;
                var v4 = stack * (this.slices + 1) + slice + 1;

                this.indices.push(v1, v2, v4);
                this.indices.push(v2, v3, v4);
            }

        }


        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

}