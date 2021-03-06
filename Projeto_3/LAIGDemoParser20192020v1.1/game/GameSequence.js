/**
 * GameSequence - Class that represents the sequence of game moves
 */
class GameSequence {
    /**
     * Constructor of the class
     * @param {GameOrchestrator} orchestrator - reference to the game orchestrator
     */
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
        this.moves = [];
    }


    /**
     * Method that resets the game sequence
     */
    reset() {
        this.moves = [];
    }


    /**
     * Method that undoes the last move
     * @return the game moves that has the board before if the undo operation was done successfully, false if not (not enough moves to backtrack)
     */
    undo() {
        if(this.moves.length < 2)
            return false;

        this.moves.pop();
        let move = this.moves[this.moves.length - 1];
        this.moves.pop();
        return move;
    }


    /**
     * Method that returns the last move made
     * @return Last move made, false if there are no moves yet
     */
    getLastMove() {
        if(this.moves.length == 0)
            return false;

        return this.moves[this.moves.length - 1];
    }


    /**
     * Method that adds a new game move to the sequence
     * @param {GameMove} gameMove - new game move to be added
     */
    addGameMove(gameMove) {
        this.moves.push(gameMove);
    }


    /**
     * Method that retrieves the move that is in that index
     * @param {int} index - index of the move in the game sequence
     * @return Copy of the move array
     */
    getMoveAt(index) {
        if(index >= this.moves.length)
            return null;

        // makes a copy of the move array
        let moveCopy = this.moves[index].moveResultsArray.map(function(arr) {
            return arr.slice();
        });

        return moveCopy;
    }


    /**
     * Method that returns all moves from the game sequence
     * @return Array with the game moves
     */
    getAllMoves() {
        return this.moves;
    }


    /**
     * Method that returns the length (number) of the moves array
     * @return Length of the move array
     */
    numberMoves() {
        return this.moves.length;
    }
}