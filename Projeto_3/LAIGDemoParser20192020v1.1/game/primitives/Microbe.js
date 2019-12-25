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
     * Display method of the microbe object
     */
    display() {
        let scene = this.orchestrator.scene;

        scene.pushMatrix();

        this.microbeTemplate.microbeMaterial.apply();

        if(this.microbeTemplate.microbeTexture != null)
            this.microbeTemplate.microbeTexture.bind();
        
        this.microbeTemplate.microbeGeometry.display();

        if(this.microbeTemplate.microbeTexture != null)
            this.microbeTemplate.microbeTexture.unbind();

        scene.popMatrix();
    }
}