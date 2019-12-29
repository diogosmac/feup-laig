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
            "MOVIE": 8,
            "SET_TIMER": 9
        });
        this.gameState = this.gameStates.LOADING_SCENE;

        this.gameStateBuffer = null; // to store the previous game state when the movie is being shown

        this.maxTimes = [15, 30, 60];
        this.maxTimeID = 0;
        this.MAX_TURN_TIME = this.maxTimes[this.maxTimeID]; // by default, each player can take up to 15 seconds in their turns (after that, the turn is passed to the other player)
        this.time = this.MAX_TURN_TIME;
        this.elapsedTime = this.time * 1000;


        this.rotatingCameraDone = false; // variable that indicates when the camera is done rotating
        this.movieRequestPending = false; // when user clicks on the "movie" button
        this.movieRequestDone = false; // when the movie request is finalized

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
        this.pointsABuffer = null; // to be used to store the points of player A when movie mode is active
        this.pointsBBuffer = null; // to be used to store the points of player B when movie mode is active
        this.currentPlayerBuffer = null; // to be used to store the current player when movie mode is active
        this.movieFrame = 0; // current movie frame
        this.movieBoardArray = this.initBoard(); // board array to be used in the movie display

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
     * Method that resets the timer after the end of a turn
     */
    resetTimer() {
        this.time = this.MAX_TURN_TIME;
        this.elapsedTime = this.time * 1000;
        this.panelsManager.updateTimer(this.time);
    }


    /**
     * Method to be called in order to reset all fields and begin a new game
     */
    resetGame() {
        this.gameSequence.reset();

        this.boardArray = this.initBoard();
        this.board.interpretBoardArray(this.boardArray);
        this.board.resetTiles();
        this.pointsA = 2;
        this.pointsB = 2;
        this.currentPlayer = 'A';

        this.resetTimer();

        this.movieRequestPending = false;
        this.movieRequestDone = false;
        this.gameStateBuffer = null;
        this.currentPlayerBuffer = null;
        this.pointsABuffer = null;
        this.pointsBBuffer = null;
        this.movieFrame = 0;
        this.movieBoardArray = this.initBoard();

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

        this.panelsManager.changeTurnPanelTexture(this.currentPlayer);
        this.panelsManager.updateScoreTextures(this.pointsA, this.pointsB);

        // TODO: fazer reset do animator
    }


    /**
     * Method that loads new templates to the game
     * @param {Array} newTemplates - array with the new templates
     */
    loadTemplates(newTemplates) {
        this.templates = newTemplates;
        this.board.loadTemplate(this.templates['board'], this.templates['microbeA'], this.templates['microbeB']);
        this.panelsManager.loadTemplate(this.templates['panelNumbers'], this.templates['panelGame'], this.templates['panelMenu']);

        this.panelsManager.changeTurnPanelTexture(this.currentPlayer);
        this.panelsManager.updateScoreTextures(this.pointsA, this.pointsB);
        this.panelsManager.updateTimer(this.time);

        this.gameState = this.gameStates.MENU;
    }


    /**
     * Method that changes the max turn duration for each turn
     * @param {int} id - ID of the duration option
     */
    changeMaxTurnDuration(id) {
        this.maxTimeID = id;
        this.MAX_TURN_TIME = this.maxTimes[this.maxTimeID];
    }


    /**
     * Method that sets the new difficulty value
     * @param {char} player - player A or B
     * @param {int} newDifficulty - new difficulty for that player (if it's computer)
     */
    changeDifficulty(player, newDifficulty) {
        if(player == 'A')
            this.difficultyA = newDifficulty;
        else if(player == 'B')
            this.difficultyB = newDifficulty;
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
        this.resetTimer();
        this.board.resetTiles();
        this.board.pickState = this.board.pickStates.NO_PICK;
    }


    /**
     * Method that alternates between the two game cameras, changing the game panels's side
     */
    rotateCamera() {
        if(this.scene.normalCamera != this.scene.graph.views["PlayerPerspective"])
            return;
        
        this.panelsManager.rotateGamePanels = !this.panelsManager.rotateGamePanels;
        this.scene.cameraRotationActive = true;
    }


    /**
     * Method that processes an undo request from the user
     * @return true if the undo was done succesfully, false otherwise
     */
    undo() {
        let move = this.gameSequence.undo(); // removes the last 2 moves (in order to be the turn of the current player)
        if(move === false) // not enough moves to backtrack
            return false;

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

        return true;
    }


    /**
     * Method that will start the movie display, if there are game moves to be shown
     */
    startMovieDisplay() {
        if(this.gameSequence.numberMoves() == 0) { // no moves yet
            return;
        }

        this.movieRequestPending = true;
    }


    // TODO: apagar depois quando implementarmos as animacoes
    sleep(milliseconds) {
        const date = Date.now();
        let currentDate = null;
        do {
          currentDate = Date.now();
        } while (currentDate - date < milliseconds);
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
     * @param {Array} boardArray - board array that is going to be modified given the move that was made
     * @param {bool} movieFlag - flag that indicates if a movie is being presented or not (false by default)
     * @return true if the move was successfull, false if it was invalid
     */
    makeMove(moveArray, boardArray, movieFlag = false) {
        if(moveArray == "invalid")
            return false;

        let skipTurnFlag = false;

        if(!movieFlag) {
            if(moveArray == "no moves" || moveArray == "timeout") { // current player has no possible moves to choose from, or timeout occured (skips turn, and score is unchanged)
                let reason = moveArray;
                skipTurnFlag = true;
                let samePointsA = this.pointsA;
                let samePointsB = this.pointsB;
                moveArray = [[reason], ["score", samePointsA, samePointsB]];
            }

            // makes a copy of the board array before making the move
            let boardBefore = boardArray.map(function(arr) {
                return arr.slice();
            });

            // makes copy of the move array before parsing and modifying it
            let moveArrayStore = moveArray.map(function(arr) {
                return arr.slice();
            });


            this.gameSequence.addGameMove(new GameMove(this, moveArrayStore, boardBefore)); // adds new game move to the sequence
        }

        if(skipTurnFlag) // when current player has no possible moves to choose from, or timeout occured (skips turn)
            return true;

            
        moveArray.shift(); // removes first element (old pos and new pos)

        // TODO: create and launch animations for the movements, when parsing the move array
        let char = this.currentPlayer == 'A' ? 'a' : 'b';

        for(let moveElement of moveArray) {
            switch(moveElement[0]) {
                case "new": // creates new microbe
                    boardArray[moveElement[1] - 1][moveElement[2] - 1] = char;
                    break;

                case "move": // moves a microbe
                    boardArray[moveElement[1] - 1][moveElement[2] - 1] = 'empty';
                    boardArray[moveElement[3] - 1][moveElement[4] - 1] = char;
                    break;

                case "cont": // contaminates an enemy microbe
                    boardArray[moveElement[1] - 1][moveElement[2] - 1] = char;
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

            case this.gameStates.MOVIE:
                this.orchestrateMovie();
                break;

            default:
                break;
        }
    }


    /**
     * Function that coordinates and manages the functioning of the "movie" mode
     */
    orchestrateMovie() {
        if(this.rotatingCameraDone) {
            this.rotatingCameraDone = false;
        }

        if(this.movieRequestPending) {
            this.movieRequestPending = false;
            this.movieRequestDone = false;
            this.movieFrame = 0;
            this.movieBoardArray = this.initBoard();
            this.board.resetTiles();
            this.board.interpretBoardArray(this.movieBoardArray);

            this.pointsABuffer = this.pointsA;
            this.pointsBBuffer = this.pointsB;
            this.currentPlayerBuffer = this.currentPlayer;

            this.currentPlayer = 'A'; // first turn is always for player A
            this.pointsA = 2;
            this.pointsB = 2;
            
            this.panelsManager.changeTurnPanelTexture(this.currentPlayer);
            this.panelsManager.updateScoreTextures(this.pointsA, this.pointsB);
        }

        if(this.movieRequestDone) { // movie was completely shown; change back to old state
            this.sleep(2000);
            
            this.pointsA = this.pointsABuffer; this.pointsABuffer = null;
            this.pointsB = this.pointsBBuffer; this.pointsBBuffer = null;
            this.currentPlayer = this.currentPlayerBuffer; this.currentPlayerBuffer = null;
            this.board.interpretBoardArray(this.boardArray); // restores the board to how it was before the movie
            this.panelsManager.changeTurnPanelTexture(this.currentPlayer);
            this.panelsManager.updateScoreTextures(this.pointsA, this.pointsB);
            this.gameState = this.gameStateBuffer;
            this.gameStateBuffer = null;
            
            if(this.gameState == this.gameStates.GAME)
                this.board.pickState = this.board.pickStates.PICK_PIECE;
            else if(this.gameState == this.gameStates.SHOW_WINNER) {
                this.scene.activeCameraID = "defaultPerspective";
                this.scene.changeCamera();
            }
        }
        else { // TODO: meter aqui condicoes com flag de modo a que so faca a proxima frame depois das animacoes estarem concluidas
            let frameMoveArray = this.gameSequence.getMoveAt(this.movieFrame);
            
            this.makeMove(frameMoveArray, this.movieBoardArray, true); // simulate the move (in movie mode)
            
            this.sleep(2000);
            
            this.board.interpretBoardArray(this.movieBoardArray);

            this.currentPlayer = this.currentPlayer == 'A' ? 'B' : 'A';
            this.panelsManager.changeTurnPanelTexture(this.currentPlayer);

            this.movieFrame++;
            if(this.movieFrame == this.gameSequence.numberMoves()) // if all game moves were displayed
                this.movieRequestDone = true;
        }
    }


    /**
     * Method that contains the game cycle when in "game" mode
     */
    orchestrateGame() {
        if(this.movieRequestPending && (this.board.pickState == this.board.pickStates.PICK_PIECE || this.board.pickState == this.board.pickStates.PICK_PLAYER_MOVE)) {
            this.gameStateBuffer = this.gameState;
            this.gameState = this.gameStates.MOVIE;
            return;
        }

        if(this.rotatingCameraDone) {
            this.rotatingCameraDone = false;
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
                        this.makeMove("no moves", this.boardArray);
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

            // TODO: quando implementar as animacoes, por mais uma flag aqui dps de chamar o makeMove que indica se as animacoes acabaram.
            //       Quando isso acontecer, fazer o interpretBoardArray, etc.
            case this.board.pickStates.ANIMATING:
                if(this.moveRequestDone) {
                    this.moveRequestDone = false;
                    this.requestSent = false;
                    if(this.makeMove(this.moveResults, this.boardArray)) { // parse move results
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
                        this.panelsManager.changeWinnerPanelTexture(this.winner);
                        this.scene.activeCameraID = "defaultPerspective";
                        this.scene.changeCamera();
                        this.gameState = this.gameStates.SHOW_WINNER;
                    }
                }
                
                break;            

            default:
                break;
        }
    }


    /**
     * Method that is in charge of updating some aspects of the game based on the time
     * @param {float} deltaTime - time difference between this function call and the last one (in millisseconds)
     */
    update(deltaTime) {
        this.animator.update(deltaTime);

        if(this.gameState == this.gameStates.GAME) {
            if(this.board.pickState != this.board.pickStates.ANIMATING && this.board.pickState != this.board.pickStates.CHECK_GAME_OVER) {
                this.elapsedTime -= deltaTime;
                this.time = Math.floor(this.elapsedTime / 1000);

                if(this.time <= 0) { // timeout ocurred
                    this.time = 0;
                    this.makeMove("timeout", this.boardArray);
                    this.board.interpretBoardArray(this.boardArray);

                    this.board.pickState = this.board.pickStates.CHECK_GAME_OVER;
                }

                this.panelsManager.updateTimer(this.time);
            }
        }
    }


    /**
     * Main display method for the whole game
     */
    display() {
        this.scene.pushMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 2.5, 0); // to get everything to table height
        this.board.display();
        this.scene.popMatrix();

        this.panelsManager.display();
        
        this.scene.popMatrix();
    }
}