/**
 * Panel - class that represents every menu or in-game panel
 */
class Panel {
    /**
     * Constructor of the class
     * @param {GameOrchestrator} orchestrator - reference to the game orchestrator
     * @param {CGFobject} geometry - geometry/object that represents the panel
     * @param {int} id - the panel's id (for picking)
     */
    constructor(orchestrator, geometry, id) {
        this.orchestrator = orchestrator;
        this.geometry = geometry;
        this.id = id || null;
    }


    /**
     * Method that loads a new panel texture from a new template
     * @param {CGFtexture} panelTexture - new panel texture
     */
    loadPanelTexture(panelTexture) {
        this.panelTexture = panelTexture;
    }


    /**
     * Display method of the panel
     */
    display() {
        if(this.id != null)
            this.orchestrator.scene.registerForPick(this.id, this);

        if(this.panelTexture != null)
            this.panelTexture.bind();

        this.geometry.display();

        if(this.panelTexture != null)
            this.panelTexture.unbind();

        if(this.id != null)
            this.orchestrator.scene.clearPickRegistration();
    }
}