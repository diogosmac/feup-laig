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
            "CHOOSE_SCENE": 4,
            "LOADING_SCENE": 5,
            "SHOW_WINNER": 6,
            "GAME_OPTIONS": 7,
            "MOVIE": 8
        });
        this.gameState = this.gameStates.LOADING_SCENE;

        this.rotatingCameraDone = false; // variable that indicates 

        this.currentPlayer = 'A'; // variable that stores the current player
        this.playerAStatus = 'H'; // by default, player A is human
        this.playerBStatus = 'C'; // by default, player B is the computer
        this.difficultyA = 1; // standard difficulty value for the player A (if it's computer)
        this.difficultyB = 1; // standard difficulty value for the player B (if it's computer)

        this.validMoves = []; // array that will have the valid moves for a user when he/she selects a microbe
        this.winner = 'no'; // variable that will contain the winner of the game
        this.moveResults = []; // array that will contain the consequences/results of each move
        this.movesAvailable = false; // variable that will tell if the human user has any valid moves to make on his/her turn

        this.checkValidMovesRequestDone = false;
        this.validMovesRequestDone = false;
        this.checkGameOverRequestDone = false;
        this.moveRequestDone = false;
    
        this.requestSent = false;


        this.pointsA = 2;
        this.pointsB = 2;

        this.board = new Board(this, this.boardArray);
        this.communicator = new Communicator(this);
        this.gameSequence = new GameSequence(this);
        this.animator = new Animator(this);
        this.panelsManager = new PanelsManager(this);
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
     * Method to be called in order to reset all fields and begin a new game
     */
    resetGame() {
        this.gameSequence.reset();

        this.boardArray = this.initBoard();
        this.board.interpretBoardArray(this.boardArray);
        this.pointsA = 2;
        this.pointsB = 2;
        this.currentPlayer = 'A';

        this.validMoves = [];
        this.winner = 'no';
        this.moveResults = [];
        this.movesAvailable = false;

        this.checkValidMovesRequestDone = false;
        this.validMovesRequestDone = false;
        this.checkGameOverRequestDone = false;
        this.moveRequestDone = false;
        this.requestSent = false;

        this.board.pickState = this.board.pickStates.NO_PICK;

        this.board.selectedTileLine = null;
        this.board.selectedTileColumn = null;

        this.panelsManager.changeTurnPanelTexture(this.currentPlayer);
        this.panelsManager.updateScoreTextures(this.pointsA, this.pointsB);
    }


    /**
     * Method that loads new templates to the game
     * @param {Array} newTemplates - array with the new templates
     */
    loadTemplates(newTemplates) {
        this.templates = newTemplates;
        this.board.loadTemplate(this.templates['board'], this.templates['microbeA'], this.templates['microbeB']);
        this.panelsManager.loadTemplate(this.templates['panelNumbers'], this.templates['panelGame'], null);

        this.panelsManager.changeTurnPanelTexture(this.currentPlayer);
        this.panelsManager.updateScoreTextures(this.pointsA, this.pointsB);

        // TODO: implement menu panels

        this.gameState = this.gameStates.GAME;
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
        this.panelsManager.changeTurnPanelTexture(this.currentPlayer);
        this.board.pickState = this.board.pickStates.NO_PICK;
    }


    /**
     * Method that alternates between the two game cameras, changing the game panels's side
     */
    rotateCamera() {
        if(this.scene.normalCamera != this.scene.graph.views["PlayerPerspective"])
            return;
        
        this.scene.cameraRotationActive = true;
    }


    /**
     * Method that processes an undo request from the user
     */
    undo() {
        let move = this.gameSequence.undo(); // removes the last 2 moves (in order to be the turn of the current player)
        if(move === false) // not enough moves to backtrack
            return;

        this.boardArray = move.boardBefore; // resets the board array 2 moves before

        let lastGameMove = this.gameSequence.getLastMove();
        if(lastGameMove === false) { // if after the undo, we are back at the start of the game
            this.pointsA = 2;
            this.pointsB = 2;
        }
        else {
            this.pointsA = lastGameMove.returnPointsA();
            this.pointsB = lastGameMove.returnPointsB();
        }


        this.board.interpretBoardArray(this.boardArray);
        this.panelsManager.updateScoreTextures(this.pointsA, this.pointsB);
    }


    /**
     * Method that manages all the picking behaviour
     * @param {*} mode - picking mode
     * @param {*} pickResults - picking results
     */
    managePick(mode, pickResults) {
        if (mode == false) {
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
            if(this.gameState != this.gameStates.GAME || 
                (this.board.pickState != this.board.pickStates.PICK_PIECE && this.board.pickState != this.board.pickStates.PICK_PLAYER_MOVE)) {
                return;
            }

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
                    
                    this.communicator.moveUser(this.currentPlayer, this.boardArray, this.board.selectedTileLine, this.board.selectedTileColumn, object.line, object.column);
                    this.board.pickState = this.board.pickStates.ANIMATING;
                    this.board.resetTiles();
                    break;

                default:
                    break;
            }
        }

        else if(object instanceof Panel) { // if a panel was selected
            this.panelsManager.onPanelSelected(object, uniqueId);
        }

        else {
            // error ?
        }
    }


    /**
     * Method that does all the process necessary to make a move
     * @param {Array} moveArray - array returned by the Prolog server that represents the move, the score and all the changes to the board
     * @return true if the move was successfull, false if it was invalid
     */
    makeMove(moveArray) {
        if(moveArray == "invalid")
            return false;

        let noMovesFlag = false;

        if(moveArray == "no moves") { // current player has no possible moves to choose from (skips turn, and score is unchanged)
            noMovesFlag = true;
            let samePointsA = this.pointsA;
            let samePointsB = this.pointsB;
            moveArray = [["no moves"], ["score", samePointsA, samePointsB]];
        }

        // makes a copy of the board array before making the move
        let boardBefore = this.boardArray.map(function(arr) {
            return arr.slice();
        });

        // makes copy of the move array before parsing and modifying it
        let moveArrayStore = moveArray.map(function(arr) {
            return arr.slice();
        });


        this.gameSequence.addGameMove(new GameMove(this, moveArrayStore, boardBefore)); // adds new game move to the sequence


        if(noMovesFlag) // when current player has no possible moves to choose from (skips turn)
            return true;

            
        moveArray.shift(); // removes first element (old pos and new pos)

        // TODO: create and launch animations for the movements, when parsing the move array
        let char = this.currentPlayer == 'A' ? 'a' : 'b';

        for(let moveElement of moveArray) {
            switch(moveElement[0]) {
                case "new": // creates new microbe
                    this.boardArray[moveElement[1] - 1][moveElement[2] - 1] = char;
                    break;

                case "move": // moves a microbe
                    this.boardArray[moveElement[1] - 1][moveElement[2] - 1] = 'empty';
                    this.boardArray[moveElement[3] - 1][moveElement[4] - 1] = char;
                    break;

                case "cont": // contaminates an enemy microbe
                    this.boardArray[moveElement[1] - 1][moveElement[2] - 1] = char;
                    break;

                case "score":
                    this.pointsA = moveElement[1];
                    this.pointsB = moveElement[2];
                    this.panelsManager.updateScoreTextures(this.pointsA, this.pointsB);
                    break;

                default:
                    break;
            }
        }

        return true;
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


    /**
     * Method that contains the game cycle when in "game" mode
     */
    orchestrateGame() {
        if(this.rotatingCameraDone) {
            this.rotatingCameraDone = false;
            this.panelsManager.rotateGamePanels = !this.panelsManager.rotateGamePanels;
        }


        switch(this.board.pickState) {
            
            case this.board.pickStates.NO_PICK:
                if(!this.requestSent) {
                    let playerStatus = this.currentPlayer == 'A' ? this.playerAStatus : this.playerBStatus;
                    if(playerStatus == 'C') { // if its computer (generate its move)
                        let difficulty = this.currentPlayer == 'A' ? this.difficultyA : this.difficultyB;
                        this.communicator.moveCPU(this.currentPlayer, this.boardArray, difficulty);
                        this.board.pickState = this.board.pickStates.ANIMATING;
                    }
                    else { // if its human (check if there are any valid moves)
                        this.communicator.checkValidMoves(this.currentPlayer, this.boardArray);
                    }
                    this.requestSent = true;
                }
                else if(this.checkValidMovesRequestDone) {
                    this.checkGameOverRequestDone = false;
                    this.requestSent = false;
                    if(this.movesAvailable) { // user has moves to choose from
                        this.board.pickState = this.board.pickStates.PICK_PIECE;
                    }
                    else { // user has no possible moves left...
                        this.makeMove("no moves");
                        this.board.interpretBoardArray(this.boardArray);
                        this.board.pickState = this.board.pickStates.CHECK_GAME_OVER;
                    }
                }

                break;


            case this.board.pickStates.PICK_PIECE:
                if(this.validMovesRequestDone) {
                    this.validMovesRequestDone = false;
                    this.board.highlightTilesForMove(this.validMoves);
                    this.board.pickState = this.board.pickStates.PICK_PLAYER_MOVE;
                }
                break;

            case this.board.pickStates.PICK_PLAYER_MOVE:
                break;

            case this.board.pickStates.ANIMATING:
                if(this.moveRequestDone) {
                    this.moveRequestDone = false;
                    this.requestSent = false;
                    if(this.makeMove(this.moveResults)) { // parse move results
                        this.board.interpretBoardArray(this.boardArray);
                        this.board.pickState = this.board.pickStates.CHECK_GAME_OVER;
                    }
                    else // invalid user move
                        this.board.pickState = this.board.pickStates.PICK_PIECE;
                }
                break;


            case this.board.pickStates.CHECK_GAME_OVER:
                if(!this.requestSent) {
                    this.communicator.checkGameOver(this.boardArray, this.pointsA, this.pointsB);
                    this.requestSent = true;
                }
                else if(this.checkGameOverRequestDone) {
                    this.checkGameOverRequestDone = false;
                    this.requestSent = false;
                    if(this.winner == 'no') {
                        this.changeTurn();
                    }
                    else {
                        console.log(this.winner);
                        // TODO: go to the "show winner" screen
                    }
                }
                
                break;            

            default:
                break;
        }
    }


    /**
     * Method that is in charge of updating some aspects of the game based on the time
     * @param {float} deltaTime - time difference between this function call and the last one 
     */
    update(deltaTime) {
        this.animator.update(deltaTime);
    }


    /**
     * Main display method for the whole game
     */
    display() {
        this.scene.pushMatrix();
        this.scene.translate(0, 2.5, 0); // to get everything to table height
        this.board.display();
        this.panelsManager.display();
        this.scene.popMatrix();
    }
}