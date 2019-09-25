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
			this.x1, this.y1, this.z1,	// 0
			this.x2, this.y2, this.z2,  // 1
			this.x3, this.y3, this.z3	// 2
		];

		// Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
		];



		// vector from point 1 to point 2
		var vector_1_2 = vec3.create();
		vector_1_2 = [
			this.x2 - this.x1,
			this.y2 - this.y1,
			this.z2 - this.z1
		];
		
		// vector from point 2 to point 3
		var vector_3_2 = vec3.create();
		vector_3_2 = [
				this.x3 - this.x2,
		  	this.y3 - this.y2,
			  this.z3 - this.z2
	    ];

		// normal to the surface of the triangle
		var normal = vec3.create();
		vec3.cross(normal, vector_1_2, vector_3_2);
		vec3.normalize(normal, normal);
			

		// normal[0] = normal[2] < 0 ? -normal[0] : normal[0];
		// normal[1] = normal[2] < 0 ? -normal[1] : normal[1];
		// normal[2] = normal[2] < 0 ? -normal[2] : normal[2];

		// console.log('normal: ' + normal[2]);

		// Facing Z positive (VERIFICAR ISTO) - (em principio esta bem assim)
		this.normals = [
			normal[0], normal[1], normal[2],
			normal[0], normal[1], normal[2],
			normal[0], normal[1], normal[2]
		];


		// calculos para as texCoords

		var a = Math.sqrt(Math.pow(this.x1 - this.x3, 2) + Math.pow(this.y1 - this.y3, 2) + Math.pow(this.z1 - this.z3, 2));
		var b = Math.sqrt(Math.pow(this.x2 - this.x1, 2) + Math.pow(this.y2 - this.y1, 2) + Math.pow(this.z2 - this.z1, 2));
		var c = Math.sqrt(Math.pow(this.x3 - this.x2, 2) + Math.pow(this.y3 - this.y2, 2) + Math.pow(this.z3 - this.z2, 2));

		var betaCos = (Math.pow(a, 2) - Math.pow(b, 2) + Math.pow(c, 2)) / (2 * a * c);
		var betaSin = Math.sqrt(1 - Math.pow(betaCos, 2));


		var listOfValues = [a, b, c];
		var maxValue = Math.max.apply(Math, listOfValues);

		a /= maxValue;
		b /= maxValue;
		c /= maxValue;


		this.texCoords = [
			c - a * betaCos, 1 - a * betaSin,
			0, 1,
			c, 1
		];


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