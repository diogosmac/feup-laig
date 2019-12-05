/**
 * Comunicator - class that represents the comunicator between the JS code and the Prolog server
 * 
 */
class Comunicator {
    // TODO: definir metodos para comunicar com o Prolog e retornar respostas em classes de JS do jogo



    /**
     * Function that converts a game board into a string, to send to the Prolog server
     * @param {Board} board - Reference to the board object
     */
    getBoardString(board) {
        let boardString = '[';
        for(let i = 0; i < board.length; i++) {
            
        }

        boardString.concat(']');
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