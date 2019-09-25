

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
        var indexCount = 0;

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

                var currentCoord = [
                    // partAng: proporção da "rotação" que já foi efetuada (ou seja, a meio tem 0.5)
                    // partRad: proporção da "altura" percorrida (base tem 0, topo tem 1, meio tem 0.5)
                ];
                
                indexCount++;
   
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

        var capIndexStart, capIndexEnd;

        // bottom cap
        capIndexStart = indexCount;
        for (var slice = 1; slice <= this.slices; slice++) {
            this.vertices.push(0, 0, 0);
            this.normals.push(0, 0, -1);
            indexCount++;
        }
        capIndexEnd = indexCount;
        for (var slice = 0; slice <= this.slices; slice++) {
            var partAng = slice / this.slices;
            var ang = partAng * Math.PI * 2;

            var sin = Math.sin(ang);
            var cos = Math.cos(ang);

            vertexX = this.base * cos;
            vertexY = this.base * sin;
            vertexZ = 0;
            this.vertices.push(vertexX, vertexY, vertexZ);

            this.normals.push(0, 0, -1);

            indexCount++;
        }
        for (var slice = 0; slice < this.slices; slice++) {
            var center = capIndexStart + slice;
            var lilUziVert = capIndexEnd + slice;
            this.indices.push(lilUziVert + 1, lilUziVert, center);
        }

        // top cap
        capIndexStart = indexCount;
        for (var slice = 1; slice <= this.slices; slice++) {
            this.vertices.push(0, 0, this.height);
            this.normals.push(0, 0, 1);
            indexCount++;
        }
        capIndexEnd = indexCount;
        for (var slice = 0; slice <= this.slices; slice++) {
            var partAng = slice / this.slices;
            var ang = partAng * Math.PI * 2;

            var sin = Math.sin(ang);
            var cos = Math.cos(ang);

            vertexX = this.top * cos;
            vertexY = this.top * sin;
            vertexZ = this.height;
            this.vertices.push(vertexX, vertexY, vertexZ);

            this.normals.push(0, 0, 1);

            indexCount++;
        }
        for (var slice = 0; slice < this.slices; slice++) {
            var center = capIndexStart + slice;
            var lilUziVert = capIndexEnd + slice;
            this.indices.push(lilUziVert, lilUziVert + 1, center);
        }

        //     var currentCoord = [
        //         1 - (i * faceWidth), 1,
        //         1 - (i * faceWidth), 0
        //     ];

        //     this.texCoords.push(...currentCoord);
        // }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

}