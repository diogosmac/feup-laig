/**
 * Communicator - class that represents the communicator between the JS code and the Prolog server
 * 
 */
class Communicator {
    // TODO: definir metodos para comunicar com o Prolog e retornar respostas em classes de JS do jogo
    /**
     * Constructor of the class
     * @param {GameOrchestrator} orchestrator - Reference to the Game Orchestrator 
     */
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
    }


    /**
     * Method that asks the Prolog server if there are any valid moves for the player (to be used in the human's turn)
     * @param {char} player - player making the move
     * @param {Array} board - current board
     */
    checkValidMoves(player, board) {
        let boardString = this.getBoardString(board);

        this.orchestrator.requestPending = true;

        let requestString = 'valid_moves(\'' + player + '\',' + boardString + ')';
        this.getPrologRequest(requestString, function(data) {
            let validMovesString = data.target.response;
            this.validMoves = [];
            if(validMovesString != '[]') {
                validMovesString = validMovesString.substr(1, validMovesString.length - 2); // removes parentheses
                validMovesString = validMovesString.split(',');

                for(let i = 0; i < validMovesString.length; i++) {
                    let move = validMovesString[i].split('-');
                    this.validMoves.push([parseInt(move[0]), parseInt(move[1]), parseInt(move[2]), parseInt(move[3])]);
                }
            }

            this.orchestrator.requestPending = false;
        });
    }


    /**
     * Method that lets a human user make a move, by moving a microbe
     * @param {char} player - player making the move
     * @param {Array} board - current board
     * @param {int} oldLine - Old line
     * @param {int} oldColumn - Old column
     * @param {int} newLine - New line
     * @param {int} newColumn - New column
     */
    moveUser(player, board, oldLine, oldColumn, newLine, newColumn) {
        let boardString = this.getBoardString(board);

        this.orchestrator.requestPending = true;

        let requestString = 'move_user_server(\'' + player + '\',' + boardString + ',' + oldLine + ',' + oldColumn + ',' + newLine + ',' + newColumn + ')';
        this.getPrologRequest(requestString, function(data) {
            let responseString = data.target.response;
            if(responseString == 'invalid')
                this.orchestrator.moveResults = responseString;
            else
                this.orchestrator.moveResults = this.parseMoveResults(responseString);

            console.log(this.orchestrator.moveResults);

            this.orchestrator.requestPending = false;
        });
    }


    /**
     * Method that lets the CPU make a move, by moving a microbe
     * @param {char} player - player making the move
     * @param {Array} board - current board
     * @param {int} difficulty - difficulty level of the CPU AI
     */
    moveCPU(player, board, difficulty) {
        let boardString = this.getBoardString(board);

        this.orchestrator.requestPending = true;

        let requestString = 'move_cpu_server(\'' + player + '\',' + boardString + ',' + difficulty + ')';
        this.getPrologRequest(requestString, function(data) {
            let responseString = data.target.response;
            if(responseString == 'no moves')
                this.orchestrator.moveResults = responseString;
            else
                this.orchestrator.moveResults = this.parseMoveResults(responseString);

            this.orchestrator.requestPending = false;
        });
    }


    /**
     * Method that checks the game over condition; if the game as ended, returns the winner
     * @param {Array} board - Current board
     * @param {int} pointsA - Player A's points
     * @param {int} pointsB - Player B's points
     */
    checkGameOver(board, pointsA, pointsB) {
        let boardString = this.getBoardString(board);

        this.orchestrator.requestPending = true;

        let requestString = 'game_over_server(' + boardString + ',' + pointsA + ',' + pointsB + ')';
        this.getPrologRequest(requestString, function(data) {
            this.orchestrator.winner = data.target.response;
            this.orchestrator.requestPending = false;
        });
    }


    /**
     * Method that gets the valid moves for a human user, after he/she selects a microbe to move
     * @param {char} player - Current player
     * @param {int} oldLine - Old line 
     * @param {int} oldColumn - Old column
     * @param {Array} board - Current board
     */
    getValidMovesUser(player, oldLine, oldColumn, board) {
        let boardString = this.getBoardString(board);

        this.orchestrator.requestPending = true;

        let requestString = 'valid_moves_user(\'' + player + '\',' + boardString + ',' + oldLine + ',' + oldColumn + ')';
        this.getPrologRequest(requestString, function(data) {
            let validMovesString = data.target.response;
            this.orchestrator.validMoves = [];
            if(validMovesString != '[]') {
                validMovesString = validMovesString.substr(1, validMovesString.length - 2); // removes parentheses
                validMovesString = validMovesString.split(',');

                for(let i = 0; i < validMovesString.length; i++) {
                    let move = validMovesString[i].split('-');
                    this.orchestrator.validMoves.push([parseInt(move[0]), parseInt(move[1])]);
                }
            }

            this.orchestrator.requestPending = false;
        });
    }


    /**
     * Auxiliary method that receives a string containing the results of a move, and returns an array with the same information
     * @param {string} moveResultsString - string containing the move results
     * @return Array containing the parsed move results
     */
    parseMoveResults(moveResultsString) {
        let moveResults = [];
        moveResultsString = moveResultsString.substr(1, moveResultsString.length - 2); // removes parentheses
        moveResultsString = moveResultsString.split('],');
        
        for(let i = 0; i < moveResultsString.length; i++) {
            moveResultsString[i] = moveResultsString[i].substr(1, moveResultsString[i].length - 1);
            if(moveResultsString[i][moveResultsString[i].length - 1] == ']')
                moveResultsString[i] = moveResultsString[i].substr(0, moveResultsString[i].length - 1);

            let result = moveResultsString[i].split(',');
            let resultArray = [result[0]];
            for(let j = 1; j < result.length; j++) {
                resultArray.push(parseInt(result[j]));
            }
            moveResults.push(resultArray);
        }
        return moveResults;
    }


    /**
     * Function that converts a game board into a string, to send to the Prolog server
     * @param {Board} board - Reference to the board object
     * @return The board string
     */
    getBoardString(board) {
        let boardString = '[';
        for(let i = 0; i < board.length; i++) {
            let boardLine = board[i];
            let lineString = '';
            if (i) lineString += ',';
            lineString += '[';
            for(let j = 0; j < boardLine.length; j++) {
                if(j) lineString += ',';
                lineString += boardLine[j];
            }
            lineString += ']';
            boardString += lineString;
        }

        boardString += ']';

        return boardString;
    } 


    /**
     * Method used to close the Prolog server
     */
    quit() {
        this.orchestrator.requestPending = true;

        this.getPrologRequest('quit', function(data) {
            if(data.target.response == 'goodbye') {
                console.log("Closed server successfully");
            }
            else {
                console.log("Error closing the server");
            }

            this.orchestrator.requestPending = false;
        });
    }



    /**
     * Method that establishes the communication with the Prolog server, making a request and handling the reply
     * @param {String} requestString - Request string to send to the Prolog server
     * @param {Function} onSuccess - Function to be executed when the request is successfull
     * @param {Function} onError - Function to be exectued when the request got an error
     * @param {int} port - Communication port to the server (default is 8081)
     */
    getPrologRequest(requestString, onSuccess, onError, port) {
        if(onSuccess === undefined) {
            onSuccess = () => console.log("Request successful. Reply: " + data.target.response);
        }
        if(onError === undefined) {
            onError = () => console.log("Error waiting for response");
        }

        var requestPort = port || 8081
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

        request.onload = onSuccess.bind(this);
        request.onerror = onError.bind(this);

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }
}