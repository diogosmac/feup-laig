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
     * Method that returns the score of player A after this move was made
     * @return Player A's score
     */
    returnPointsA() {
        return this.moveResultsArray[this.moveResultsArray.length - 1][1];
    }


    /**
     * Method that returns the score of player B after this move was made
     * @return Player B's score
     */
    returnPointsB() {
        return this.moveResultsArray[this.moveResultsArray.length - 1][2];
    }


    /**
     * Method that animates, on the board, the game move (uses the Animator class)
     */
    animate() {

    }
}