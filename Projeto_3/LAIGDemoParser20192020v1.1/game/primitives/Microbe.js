/**
 * Microbe - Class that represents a piece of the game
 */
class Microbe {
	/**
	 * Constructor of the class
	 * @param {GameOrchestrator} orchestrator - reference to the game orchestrator
	 * @param {char} type - character that indicates if the microbe belongs to player A or B
	 */
	constructor(orchestrator, type) {
		this.orchestrator = orchestrator;
		this.type = type;
		this.animationMatrix = mat4.create();
		mat4.identity(this.animationMatrix); // creates identity matrix for the animations
		// mat4.translate(this.animationMatrix, this.animationMatrix, [0, 1, 0]);
	}


	// /**
	//  * Method that sets a new animation matrix for the microbe
	//  * @param {Array} newMatrix - new animation matrix
	//  */
	// setAnimationMatrix(newMatrix) {
	// 	this.animationMatrix = newMatrix;
	// }


	// /**
	//  * Method that resets the microbe's animation matrix
	//  */
	// resetAnimationMatrix() {
	// 	mat4.identity(this.animationMatrix);
	// }


	/**
	 * Method to receive a new template from the XML file
	 * @param {MicrobeTemplate} newTemplate - new microbe template
	 */
	loadTemplate(newTemplate) {
		this.microbeTemplate = newTemplate;
	}


	/**
	 * Method that assigns the microbe to a certain tile
	 * @param {Tile} tile - the tile where the microbe is currently on
	 */
	assignMicrobeToTile(tile) {
		this.tile = tile;
	}

	/**
	 * Method that allows the microbe to keep track of time
	 */
	update(t) {
		if (this.animation != null)
			if (this.animation.animationDone)
				this.animation = null;
			else
				this.animation.generateAnimationMatrix(t);
	}

	/**
	 * Display method of the microbe object
	 */
	display() {
		let scene = this.orchestrator.scene;

		this.microbeTemplate.microbeMaterial.apply();

		if(this.microbeTemplate.microbeTexture != null)
		this.microbeTemplate.microbeTexture.bind();

		scene.pushMatrix();
		// scene.multMatrix(this.animationMatrix);
		if (this.animation != null)
			this.animation.apply();
		this.microbeTemplate.microbeGeometry.display();
		scene.popMatrix();

		if(this.microbeTemplate.microbeTexture != null)
			this.microbeTemplate.microbeTexture.unbind();

	}
}
