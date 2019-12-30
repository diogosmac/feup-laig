/**
 * SideBoard - class that represents a side board
 */
class SideBoard {
    /**
     * Constructor of the class
     * @param {GameOrchestrator} orchestrator - reference to the game orchestrator
     * @param {char} type - type of piece the side board contains (for player A or B)
     */
    constructor(orchestrator, type) {
        this.orchestrator = orchestrator;
        this.type = type;
        this.microbe = null;
        this.x = null;
        this.y = null;
    }


    /**
     * Method that loads a new side board template
     * @param {SideBoardTemplate} newTemplate - new side board template 
     */
    loadTemplate(newTemplate) {
        this.sideBoardTemplate = newTemplate;
        this.x = this.sideBoardTemplate.x;
        this.y = this.sideBoardTemplate.y;
    }


    /**
     * Method that creates a new microbe
     * @param {MicrobeTemplate} microbeTemplate - template for the new microbe
     */
    generateNewMicrobe(microbeTemplate) {
        this.microbe = new Microbe(this.orchestrator, this.type);
        this.microbe.loadTemplate(microbeTemplate);
    }


    /**
     * Method that displays the side board on the scene
     */
    display() {
        let scene = this.orchestrator.scene;

        this.sideBoardTemplate.sideBoardMat.apply();
		if (this.sideBoardTemplate.sideBoardTexture != null) {
			this.sideBoardTemplate.sideBoardTexture.bind();
		}

        scene.pushMatrix();
        scene.translate(this.sideBoardTemplate.y, 0, this.sideBoardTemplate.x);
        this.sideBoardTemplate.sideBoardGeometry.display();
        
        if(this.microbe != null)
            this.microbe.display();
        
        scene.popMatrix();
            
		if (this.sideBoardTemplate.sideBoardTexture != null)
			this.sideBoardTemplate.sideBoardTexture.unbind();
    }
}