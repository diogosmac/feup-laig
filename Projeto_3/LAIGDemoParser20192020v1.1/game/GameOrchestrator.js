/**
 * GameOrchestrator - Main class of the game. Controls the game cycle and everything happening
 */
class GameOrchestrator {
    /**
     * Constructor of the class
     * @param {XMLScene} scene - Reference to the scene object
     */
    constructor(scene) {
        this.scene = scene;
        this.comunicator = new Comunicator();
        this.gameStates = []; // array de game states
    }

    /**
     * Function that contains the main game cycle
     */
    orchestrate() {

    }
}