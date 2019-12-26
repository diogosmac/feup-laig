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
     * Method that adds a new game move to the sequence
     * @param {GameMove} gameMove - new game move to be added
     */
    addGameMove(gameMove) {
        this.moves.push(gameMove);
    }
}