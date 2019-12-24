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
        this.board = new Board(this);

        this.gameStates = []; // array de game states
        this.requestPending = false; // flag to indicate if a request is pending or not

        this.validMoves = []; // array that will have the valid moves for a user when he/she selects a microbe
        this.winner = 'no'; // variable that will contain the winner of the game
        this.moveResults = []; // array that will contain the consequences/results of each move

        this.boardArray = this.initBoard(); // initiates the structure representing the game board
    }


    /**
     * Method that generates the initial game board
     * @return Array of arrays containing all the board positions
     */
    initBoard() {
        let boardArray = [[  'a'  , 'empty', 'empty', 'empty', 'empty', 'empty',   'b'  ],
                          ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
                          ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
                          ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
                          ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
                          ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
                          [  'b'  , 'empty', 'empty', 'empty', 'empty', 'empty',   'a'  ]];
        return boardArray;
    }

    /**
     * Method that loads new templates to the game
     * @param {Array} newTemplates - array with the new templates
     */
    loadTemplates(newTemplates) {
        this.templates = newTemplates;
        this.board.loadTemplate(this.templates['board']);
    }


    /**
     * Method that manages all the picking behaviour
     * @param {*} mode - picking mode
     * @param {*} pickResults - picking results
     */
    managePick(mode, pickResults) {
        if (mode == false /* && some other game conditions */) {
            if (pickResults != null && pickResults.length > 0) { // any results?
                for (let i=0; i< pickResults.length; i++) {
                    let obj = pickResults[i][0]; // get object from result
                        if (obj) { // exists?
                            var uniqueId = pickResults[i][1] // get id
                            this.onObjectSelected(obj, uniqueId);
                        }
                 }
                 pickResults.splice(0, pickResults.length);
            }
        }
    }


    /**
     * Method that is called when a pickable game object is picked
     * @param {*} object - object picked
     * @param {int} uniqueId - unique ID of the picked object
     */
    onObjectSelected(object, uniqueId) {
        if(object instanceof Tile) { // a tile was picked
            this.board.toggleTile(uniqueId);

        }
        else {
            // error ?
        }
    }


    /**
     * Method that does all the process necessary to make a move
     * @param {Array} moveArray - array 
     */
    makeMove(moveArray) {

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
        this.scene.pushMatrix();
        this.scene.translate(0, 2.5, 0); // to get everything to table height
        this.board.display();
        this.scene.popMatrix();
    }
}