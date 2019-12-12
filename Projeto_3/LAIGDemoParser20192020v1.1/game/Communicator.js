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
     * Method that gets the valid moves for a human user, after he/she selects a microbe to move
     * @param {char} player - Current player
     * @param {int} oldLine - Old line 
     * @param {int} oldColumn - Old column
     * @param {Array} board - Current board
     */
    getValidMovesUser(player, oldLine, oldColumn, board) {

        let boardString = this.getBoardString(board);

        this.orchestrator.requestPending = true;

        let requestString = 'valid_moves_user(' + player + ',' + boardString + ',' + oldLine + ',' + oldColumn + ')';
        getPrologRequest(requestString, function(data) {
            let validMovesString = data.target.response;
            validMovesString = validMovesString.substr(1, validMovesString.length - 2); // removes parentheses
            validMovesString = validMovesString.split(',');
            this.validMoves = [];
            for(let i = 0; i < validMovesString.length; i++) {
                let move = validMovesString[i].split('-');
                this.validMoves.push([parseInt(move[0]), parseInt(move[1])]);
            }
            this.orchestrator.requestPending = false;
        });
    }

    /**
     * Function that converts a game board into a string, to send to the Prolog server
     * @param {Board} board - Reference to the board object
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
     * Method that establishes the communication with the Prolog server, making a request and handling the reply
     * @param {String} requestString - Request string to send to the Prolog server
     * @param {Function} onSuccess - Function to be executed when the request is successfull
     * @param {Function} onError - Function to be exectued when the request got an error
     * @param {int} port - Communication port to the server (default is 8081)
     */
    getPrologRequest(requestString, onSuccess, onError, port) {
        var requestPort = port || 8081
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

        request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
        request.onerror = onError || function(){console.log("Error waiting for response");};

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }
}