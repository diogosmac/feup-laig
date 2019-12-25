/**
 * Microbe - Class that represents a piece of the game
 */
class Microbe {
    /**
     * Constructor of the class
     * @param {GameOrchestrator} orchestrator - reference to the game orchestrator
     * @param {Tile} tile - reference to the board tile the microbe is currently on
     */
    constructor(orchestrator, tile) {
        this.orchestrator = orchestrator;
        this.tile = tile;
    }

    /**
     * Method to receive a new template from the XML file
     * @param {MicrobeTemplate} newTemplate - new microbe template
     */
    loadTemplate(newTemplate) {
        this.microbeTemplate = newTemplate;
    }

    /**
     * Display method of the microbe object
     */
    display() {
        let scene = this.orchestrator.scene;

        scene.pushMatrix();

        this.microbeTemplate.microbeMaterial.apply();

        if(this.microbeTemplate.microbeTexture != null)
            this.microbeTemplate.microbeTexture.bind();
        
        scene.scale(this.microbeTemplate.microbeScale, this.microbeTemplate.microbeScale, this.microbeTemplate.microbeScale);
        this.microbeTemplate.microbeGeometry.display();

        if(this.microbeTemplate.microbeTexture != null)
            this.microbeTemplate.microbeTexture.unbind();

        scene.popMatrix();
    }
}