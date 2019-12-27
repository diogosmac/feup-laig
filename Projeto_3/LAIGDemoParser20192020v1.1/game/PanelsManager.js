/**
 * PanelsManager - class that manages and displays all the menu and game panels
 */
class PanelsManager {
    /**
     * Constructor of the class
     * @param {GameOrchestrator} orchestrator - reference to the game orchestrator
     */
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
        let scene = this.orchestrator.scene;

        this.panelIDs = Object.freeze({
            "UNDO": 100,
            "ROTATE": 101,
        });

        this.panelMaterial = new CGFappearance(this.orchestrator.scene);
        this.panelMaterial.setShininess(1);
        this.panelMaterial.setAmbient(0, 0, 0, 1);
        this.panelMaterial.setDiffuse(0.7, 0.7, 0.7, 1);
        this.panelMaterial.setSpecular(0, 0, 0, 1);
        this.panelMaterial.setEmission(0, 0, 0, 1);


        // TODO: menu panels

        // game panels
        this.undoPanel = new Panel(this.orchestrator, new MyRectangleXZ(scene, 'undoPanelRec', -0.5, 0.5, -0.75, 0.75), this.panelIDs.UNDO);
        this.rotatePanel = new Panel(this.orchestrator, new MyRectangleXZ(scene, 'rotatePanelRec', -0.5, 0.5, -0.75, 0.75), this.panelIDs.ROTATE);
        this.turnPanel = new Panel(this.orchestrator, new MyRectangleXZ(scene, 'turnPanelRec', -0.5, 0.5, -0.75, 0.75));
        
        this.timerPanel = new Panel(this.orchestrator, new MyRectangleXZ(scene, 'timerPanelRec', -0.25, 0.25, -0.75, 0.75));
        this.timerValuePanel1 = new Panel(this.orchestrator, new MyRectangleXZ(scene, 'timerValuePanelRec1', -0.25, 0.25, -0.375, 0.375));
        this.timerValuePanel2 = new Panel(this.orchestrator, new MyRectangleXZ(scene, 'timerValuePanelRec2', -0.25, 0.25, -0.375, 0.375));

        this.scoreAPanel = new Panel(this.orchestrator, new MyRectangleXZ(scene, 'scoreAPanelRec', -0.25, 0.25, -0.75, 0.75));
        this.scoreAValuePanel1 = new Panel(this.orchestrator, new MyRectangleXZ(scene, 'scoreAValuePanelRec1', -0.25, 0.25, -0.375, 0.375));
        this.scoreAValuePanel2 = new Panel(this.orchestrator, new MyRectangleXZ(scene, 'scoreAValuePanelRec2', -0.25, 0.25, -0.375, 0.375));

        this.scoreBPanel = new Panel(this.orchestrator, new MyRectangleXZ(scene, 'scoreBPanelRec', -0.25, 0.25, -0.75, 0.75));
        this.scoreBValuePanel1 = new Panel(this.orchestrator, new MyRectangleXZ(scene, 'scoreBValuePanelRec1', -0.25, 0.25, -0.375, 0.375));
        this.scoreBValuePanel2 = new Panel(this.orchestrator, new MyRectangleXZ(scene, 'scoreBValuePanelRec2', -0.25, 0.25, -0.375, 0.375));


        this.rotateGamePanels = false;
    }


    /**
     * Method that updates all panel textures when a new template is loaded
     * @param {NumbersTemplate} numbersTemplate - template that stores all the textures that represent numbers
     * @param {GamePanelTemplate} gamePanelTemplate - template that stores all the textures for the game panels
     * @param {MenuPanelTemplate} menuPanelTemplate - template that stores all the textures for the menu panels
     */
    loadTemplate(numbersTemplate, gamePanelTemplate, menuPanelTemplate) {
        this.numbersTemplate = numbersTemplate;
        this.gamePanelTemplate = gamePanelTemplate;

        this.undoPanel.loadPanelTexture(this.gamePanelTemplate.undoTexture);
        this.rotatePanel.loadPanelTexture(this.gamePanelTemplate.rotateTexture);
        this.timerPanel.loadPanelTexture(this.gamePanelTemplate.timerTexture);
        this.scoreAPanel.loadPanelTexture(this.gamePanelTemplate.scoreATexture);
        this.scoreBPanel.loadPanelTexture(this.gamePanelTemplate.scoreBTexture);


        // TODO: implement timer
        this.timerValuePanel1.loadPanelTexture(this.numbersTemplate.getNumberTextureUnits(0));
        this.timerValuePanel2.loadPanelTexture(this.numbersTemplate.getNumberTextureUnits(0));
    }


    /**
     * Method that updates the panel texture showing which player has the current turn
     * @param {char} player - player A or B
     */
    changeTurnPanelTexture(player) {
        let turnTexture = player == 'A' ? this.gamePanelTemplate.playerATurnTexture : this.gamePanelTemplate.playerBTurnTexture;
        this.turnPanel.loadPanelTexture(turnTexture);
    }


    /**
     * Method that, given the current score, updates the textures to be used in the panels that display the score
     * @param {int} pointsA - player A's score
     * @param {int} pointsB - player B's score
     */
    updateScoreTextures(pointsA, pointsB) {
        this.scoreAValuePanel1.loadPanelTexture(this.numbersTemplate.getNumberTextureDozens(pointsA));
        this.scoreAValuePanel2.loadPanelTexture(this.numbersTemplate.getNumberTextureUnits(pointsA));

        this.scoreBValuePanel1.loadPanelTexture(this.numbersTemplate.getNumberTextureDozens(pointsB));
        this.scoreBValuePanel2.loadPanelTexture(this.numbersTemplate.getNumberTextureUnits(pointsB));
    }


    /**
     * Method that, given the current time, updates the textures to be used in the panels that display the timer value
     * @param {int} time - timer value, in seconds
     */
    updateTimer(time) {

    }


    /**
     * Method that manages picking operations and actions for the panels
     * @param {Panel} panel - panel that was picked/selected 
     * @param {int} uniqueId - unique ID of that panel
     */
    onPanelSelected(panel, uniqueId) {

    }


    /**
     * Display method for all the panels
     */
    display() {
        let scene = this.orchestrator.scene;
        this.panelMaterial.apply();
        scene.pushMatrix();
        
        switch(this.orchestrator.gameState) {
            case this.orchestrator.gameStates.GAME:
                
                if(this.rotateGamePanels)
                scene.rotate(Math.PI, 0, 1, 0);
                
                scene.pushMatrix();
                scene.translate(4, 0, -3.75);
                scene.rotate(-Math.PI / 4, 0, 0, 1);
                this.rotatePanel.display();
                scene.popMatrix();
                
                scene.pushMatrix();
                scene.translate(4, 0, -2.25);
                scene.rotate(-Math.PI / 4, 0, 0, 1);
                this.undoPanel.display();
                scene.popMatrix();
                
                scene.pushMatrix();
                scene.translate(4, 0, -0.75);
                scene.rotate(-Math.PI / 4, 0, 0, 1);
                this.turnPanel.display();
                scene.popMatrix();

                scene.pushMatrix();
                scene.translate(4 - (Math.sqrt(2) / 8), Math.sqrt(2) / 8, 0.75);
                scene.rotate(-Math.PI / 4, 0, 0, 1);
                this.timerPanel.display();
                scene.popMatrix();

                scene.pushMatrix();
                scene.translate(4 + (Math.sqrt(2) / 8), -Math.sqrt(2) / 8, 0.375);
                scene.rotate(-Math.PI / 4, 0, 0, 1);
                this.timerValuePanel2.display();
                scene.popMatrix();

                scene.pushMatrix();
                scene.translate(4 + (Math.sqrt(2) / 8), -Math.sqrt(2) / 8, 1.125);
                scene.rotate(-Math.PI / 4, 0, 0, 1);
                this.timerValuePanel1.display();
                scene.popMatrix();

                scene.pushMatrix();
                scene.translate(4 - (Math.sqrt(2) / 8), Math.sqrt(2) / 8, 2.25);
                scene.rotate(-Math.PI / 4, 0, 0, 1);
                this.scoreAPanel.display();
                scene.popMatrix();
                
                scene.pushMatrix();
                scene.translate(4 + (Math.sqrt(2) / 8), -Math.sqrt(2) / 8, 1.875);
                scene.rotate(-Math.PI / 4, 0, 0, 1);
                this.scoreAValuePanel2.display();
                scene.popMatrix();
                
                scene.pushMatrix();
                scene.translate(4 + (Math.sqrt(2) / 8), -Math.sqrt(2) / 8, 2.625);
                scene.rotate(-Math.PI / 4, 0, 0, 1);
                this.scoreAValuePanel1.display();
                scene.popMatrix();
                
                scene.pushMatrix();
                scene.translate(4 - (Math.sqrt(2) / 8), Math.sqrt(2) / 8, 3.75);
                scene.rotate(-Math.PI / 4, 0, 0, 1);
                this.scoreBPanel.display();
                scene.popMatrix();
                
                scene.pushMatrix();
                scene.translate(4 + (Math.sqrt(2) / 8), -Math.sqrt(2) / 8, 3.375);
                scene.rotate(-Math.PI / 4, 0, 0, 1);
                this.scoreBValuePanel2.display();
                scene.popMatrix();
                
                scene.pushMatrix();
                scene.translate(4 + (Math.sqrt(2) / 8), -Math.sqrt(2) / 8, 4.125);
                scene.rotate(-Math.PI / 4, 0, 0, 1);
                this.scoreBValuePanel1.display();
                scene.popMatrix();
                break;

            default:
                break;
        }

        scene.popMatrix();
    }
}