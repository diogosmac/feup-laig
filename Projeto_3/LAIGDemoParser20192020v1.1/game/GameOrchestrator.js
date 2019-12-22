/**
 * GameOrchestrator - Main class of the game. Controls the game cycle and everything happening
 */
class GameOrchestrator {
    /**
     * Constructor of the class
     * @param {XMLScene} scene - Reference to the scene object
     * @param {Array} templates - Array with all game object templates
     */
    constructor(scene, templates) {
        this.scene = scene;
        this.templates = templates;
        this.communicator = new Communicator(this);
        this.gameStates = []; // array de game states
        this.requestPending = false; // flag to indicate if a request is pending or not

        this.validMoves = []; // array that will have the valid moves for a user when he/she selects a microbe
        this.winner = 'no'; // variable that will contain the winner of the game
        this.moveResults = []; // array that will contain the consequences/results of each move
    }


    /**
     * Method that loads new templates to the game
     * @param {Array} newTemplates - array with the new templates
     */
    loadTemplates(newTemplates) {

    }


    /**
     * Function that contains the main game cycle
     */
    orchestrate() {

    }


    /**
     * Main display method for the whole game
     */
    display() {

    }
}