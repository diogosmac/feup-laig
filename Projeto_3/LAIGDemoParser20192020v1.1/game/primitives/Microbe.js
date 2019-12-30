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
		this.animation = null;
	}


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
	 * @param {float} deltaTime - time difference between this call and the last call
	 */
	update(deltaTime) {
		if (this.animation != null)
			this.animation.generateAnimationMatrix(deltaTime);
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
		if (this.animation != null)
			this.animation.apply();

		this.microbeTemplate.microbeGeometry.display();
		scene.popMatrix();

		if(this.microbeTemplate.microbeTexture != null)
			this.microbeTemplate.microbeTexture.unbind();

	}
}
