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
        this.boardArray = this.initBoard(); // initiates the structure representing the game board
        
        this.gameStates = Object.freeze({
            "MENU": 1,
            "GAME": 2,
            "DIFFICULTY": 3,
            "SCENES": 4,
            "GAME_OPTIONS": 5,
        });
        this.gameState = this.gameStates.GAME;


        this.currentPlayer = 'A'; // variable that stores the current player
        this.playerAStatus = 'H'; // by default, player A is human
        this.playerBStatus = 'C'; // by default, player B is the computer
        this.difficultyA = 1; // standard difficulty value for the player A (if it's computer)
        this.difficultyB = 1; // standard difficulty value for the player B (if it's computer)

        this.validMoves = []; // array that will have the valid moves for a user when he/she selects a microbe
        this.winner = 'no'; // variable that will contain the winner of the game
        this.moveResults = []; // array that will contain the consequences/results of each move
        
        this.checkValidMovesRequestDone = false;
        this.validMovesRequestDone = false;
        this.checkGameOverRequestDone = false;
        this.moveRequestDone = false;
    
        this.board = new Board(this, this.boardArray);
        this.communicator = new Communicator(this);
    }


    /**
     * Method that generates the initial game board
     * @return Array of arrays containing all the board positions
     */
    initBoard() {
        // let boardArray = [[  'a'  , 'empty', 'empty', 'empty', 'empty', 'empty',   'b'  ],
        //                   ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
        //                   ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
        //                   ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
        //                   ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
        //                   ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
        //                   [  'b'  , 'empty', 'empty', 'empty', 'empty', 'empty',   'a'  ]];

        // just to test stuff
        let boardArray = [[  'a'  , 'empty', 'empty', 'empty', 'empty', 'empty',   'b'  ],
                          ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
                          ['empty', 'a', 'b', 'empty', 'a', 'empty', 'empty'],
                          ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
                          ['empty', 'empty', 'b', 'empty', 'a', 'b', 'empty'],
                          ['empty', 'b', 'empty', 'a', 'a', 'empty', 'empty'],
                          [  'b'  , 'empty', 'empty', 'empty', 'empty', 'empty',   'a'  ]];
        return boardArray;
    }


    /**
     * Method that loads new templates to the game
     * @param {Array} newTemplates - array with the new templates
     */
    loadTemplates(newTemplates) {
        this.templates = newTemplates;
        this.board.loadTemplate(this.templates['board'], this.templates['microbeA'], this.templates['microbeB']);
    }


    /**
     * Method that sets the new difficulty value
     * @param {int} newDifficultyA - the new difficulty value for player A
     * @param {int} newDifficultyB - the new difficulty value for player B
     */
    changeDifficulty(newDifficultyA, newDifficultyB) {
        this.difficultyA = newDifficultyA;
        this.difficultyB = newDifficultyB;
    }


    /**
     * Method that changes the game options (whether players A and B are computers or humans)
     * @param {int} newOption - integer value specifying the new game option 
     */
    changeGameOption(newOption) {
        switch(newOption) {
            case 1: // PVP
                this.playerAStatus = 'H';
                this.playerBStatus = 'H';
                break;

            case 2: // PVC
                this.playerAStatus = 'H';
                this.playerBStatus = 'C';
                break;

            case 3: // CVC
                this.playerAStatus = 'C';
                this.playerBStatus = 'C';
                break;
            
            default:
                break;
        }
    }

    /**
     * Method that changes the turn, alternating the current player
     */
    changeTurn() {
        this.currentPlayer = this.currentPlayer == 'A' ? 'B' : 'A';
    }


    /**
     * Method that manages all the picking behaviour
     * @param {*} mode - picking mode
     * @param {*} pickResults - picking results
     */
    managePick(mode, pickResults) {
        if (mode == false && (this.board.pickState == this.board.pickStates.PICK_PIECE || this.board.pickState == this.board.pickStates.PICK_PLAYER_MOVE)) {
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
            switch(this.board.pickState) {

                case this.board.pickStates.PICK_PIECE:
                    this.board.resetTiles();
                    this.board.selectTile(uniqueId);
                    this.communicator.getValidMovesUser(this.currentPlayer, object.line, object.column, this.boardArray);
                    break;

                case this.board.pickStates.PICK_PLAYER_MOVE:
                    if(!object.highlighted || this.board.selectedTileLine == null || this.board.selectedTileColumn == null) {
                        this.board.pickState = this.board.pickStates.PICK_PIECE;
                        this.onObjectSelected(object, uniqueId);
                        return;
                    }
                    
                    this.board.pickState = this.board.pickStates.PICK_PIECE;
                    // this.communicator.moveUser(this.currentPlayer, this.boardArray, this.board.selectedTileLine, this.board.selectedTileColumn, object.line, object.column);
                    this.board.resetTiles();
                    break;

                default:
                    break;
            }
        }
        else {
            // error ?
        }
    }


    /**
     * Method that does all the process necessary to make a move
     * @param {Array} moveArray - array that 
     */
    makeMove(moveArray) {

    }

    
    /**
     * Function that contains the main game cycle (called regularly by XMLScene's display/render method)
     */
    orchestrate() {
        switch(this.gameState) {

            case this.gameStates.GAME:
                this.orchestrateGame();
                break;

            default:
                break;
        }
    }


    orchestrateGame() {
        switch(this.board.pickState) {
            
            case this.board.pickStates.PICK_PIECE:
                if(this.validMovesRequestDone) {
                    this.validMovesRequestDone = false;
                    this.board.highlightTilesForMove(this.validMoves);
                    this.board.pickState = this.board.pickStates.PICK_PLAYER_MOVE;
                }
                break;

            case this.board.pickStates.PICK_PLAYER_MOVE:
                break;
        }
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