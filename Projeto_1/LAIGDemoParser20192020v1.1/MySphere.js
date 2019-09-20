/**
 * MySphere
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - ID of the object
 * @param radius - Radius of the sphere
 * @param slices - Number of desired slices
 * @param stacks - Number of desired stacks
 */
class MySphere extends CGFobject {

    constructor(scene, id, radius, slices, stacks) {
        super(scene);
        this.id = id;
        this.slices = slices;
        this.stacks = stacks;
        this.radius = radius;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.texCoords = [];

        var angHor = (2*Math.PI) / this.slices;
        var angVer = (Math.PI / 2) / this.stacks;

        for (var stack = 0; stack <= this.stacks; stack++) {

            for (var slice = 0; slice <= this.slices; slice++) {

                var stackSin = Math.sin(stack * angVer);
                var stackCos = Math.cos(stack * angVer);
                var sliceSin = Math.sin(slice * angHor);
                var sliceCos = Math.cos(slice * angHor);

                this.vertices.push(
                    this.radius * stackSin * sliceCos,
                    this.radius * stackSin * sliceSin,
                    this.radius * stackCos
                );

                this.normals.push(
                    stackSin * sliceCos,
                    stackSin * sliceSin,
                    stackCos
                );

                this.texCoords.push(
                    slice / this.slices, 
                    stack / this.stacks
                );

            }

        }

        for (var stack = 0; stack < this.stacks; stack++) {
            
            for (var slice = 0; slice < this.slices; slice++) {

                this.indices.push(
                    stack * (this.slices + 1) + slice,
                    (stack + 1) * (this.slices + 1) + slice,
                    (stack + 1) * (this.slices + 1) + slice + 1
                );

                this.indices.push(
                    stack * (this.slices + 1) + slice,
                    (stack + 1) * (this.slices + 1) + slice + 1,
                    stack * (this.slices + 1) + slice + 1
                );

            }

        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();

    }

}