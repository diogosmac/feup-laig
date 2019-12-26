/**
 * GameMove - Class that represents a movement 
 */
class GameMove {
    /**
     * Constructor of the class
     * @param {GameOrchestrator} orchestrator - reference to the game orchestrator
     * @param {Array} moveResultsArray - array returned by the Prolog server that represents the move, the score and all the changes to the board
     * @param {Array} boardBefore - array of arrays representing the state of the board before the move was made
     */
    constructor(orchestrator, moveResultsArray, boardBefore) {
        this.orchestrator = orchestrator;
        this.moveResultsArray = moveResultsArray;
        this.boardBefore = boardBefore;
    }

    /**
     * Method that animates, on the board, the game move (uses the Animator class)
     */
    animate() {

    }
}