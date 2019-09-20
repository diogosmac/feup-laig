/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - ID of the object
 * @param x1 - X coordinate of the 1st vertex
 * @param y1 - Y coordinate of the 1st vertex
 * @param z1 - Z coordinate of the 1st vertex 
 * @param x2 - X coordinate of the 2nd vertex
 * @param y2 - Y coordinate of the 2nd vertex
 * @param z2 - Z coordinate of the 2nd vertex
 * @param x3 - X coordinate of the 3rd vertex
 * @param y3 - Y coordinate of the 3rd vertex
 * @param z3 - Z coordinate of the 3rd vertex
 */
class MyTriangle extends CGFobject {
	constructor(scene, id, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
		super(scene);
		this.id = id;
		this.x1 = x1;
		this.y1 = y1;
		this.z1 = z1;
		this.x2 = x2;
		this.y2 = y2;
		this.z2 = z2;
		this.x3 = x3;
		this.y3 = y3;
		this.z3 = z3;

		this.initBuffers();
    }

    initBuffers() {
		this.vertices = [
			this.x1, this.y1, this.z1,	//0
			this.x2, this.y2, this.z2,  //1
			this.x3, this.y3, this.z3		//2
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
		];

		// vector from point 1 to point 2
		var vector_1_2 = vec3.create();
		vector_1_2 = [this.x2 - this.x1,
									this.y2 - this.y1,
									this.z2 - this.z1];
		
		// vector from point 3 to point 2
		var vector_3_2 = vec3.create();
		vector_3_2 = [this.x3 - this.x2,
									this.y3 - this.y2,
									this.z3 - this.z2];

		// normal to the surface of the triangle
		var normal = vec3.create();
		vec3.cross(normal, vector_1_2, vector_3_2);
		vec3.normalize(normal, normal);
			

		//Facing Z positive (VERIFICAR ISTO)
		this.normals = [
			normal[0], normal[1], normal[2],
			normal[0], normal[1], normal[2],
			normal[0], normal[1], normal[2]
		];

		this.texCoords = [
			// VER AQUELE DOCUMENTO QUANDO SAIR
		]
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
    }
    
    /**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}
}