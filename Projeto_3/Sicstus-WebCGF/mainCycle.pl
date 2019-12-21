:- consult('logic.pl').
:- use_module(library(lists)).

% <game initialization>

% -- Predicate that displays the main menu, and asks the player for all the necessary information
% -- to initialize the game, such as the difficulty level(s), etc
% -- After that, initializes the game state, resetting the board and player scores
startGame :-
    printMenu,
    askBetweenValues(Option, 1, 3),
    setPlayerTypes(Option),
    askDifficulty(Option).

% </game initialization>

% <game state manipulation>

% -- Predicate that obtains the current state of the game (board)
getState(Board) :-
    removeBoard(Board).

% -- Predicate that processes a player's turn, modifying the game state (board and scores)
changeState(Board, NewBoard) :-
    turn(Player),
    display_game(Board, Player),
    playerType(Player, PlayerType),
    getMoveFromPlayer(Player, PlayerType, Board, movement(OldLine, OldColumn, NewLine, NewColumn)),
    makeMove(Player, movement(OldLine, OldColumn, NewLine, NewColumn), Board, NewBoard),
    updatePointsNewBoard(NewBoard).


% -- Predicate that applies the chosen movement to the board, generating a new one (verifies if the move is valid)

% -- Special case; if the movement generated was (0, 0, 0, 0), then no valid move is available for the player and the turn is skiped
makeMove(_, movement(0, 0, 0, 0), Board, Board) :-
    printNoValidMoves, !.

makeMove(Player, movement(OldLine, OldColumn, NewLine, NewColumn), Board, NewBoard) :-
    move(Player, OldLine, OldColumn, NewLine, NewColumn, Board, NewBoard), !.

% -- will only fail if the player is human; asks again
makeMove(Player, _, Board, NewBoard) :-
    printInvalidMove,
    askPlayerMove(Player, NextOldLine, NextOldColumn, NextNewLine, NextNewColumn),
    makeMove(Player, movement(NextOldLine, NextOldColumn, NextNewLine, NextNewColumn), Board, NewBoard).

% -- Predicate that processes the turn, depending on whether the player is Human or the Computer

% -- -- Case where the player is Human
% -- -- valid_moves() must be called, to check whether the human has a valid move to make
getMoveFromPlayer(Player, 'H', Board, movement(OldLine, OldColumn, NewLine, NewColumn)) :-
    valid_moves(Player, Board, ListOfValidMoves),
    checkValidMoves(Player, ListOfValidMoves, movement(OldLine, OldColumn, NewLine, NewColumn)).


% -- -- Case where the player is controlled by the Computer
% -- -- Obtains the difficulty level for the Computer controlled player, and chooses
% -- -- the move based on it
getMoveFromPlayer(Player, 'C', Board, movement(OldLine, OldColumn, NewLine, NewColumn)) :-
    difficulty(Player, Level),
    choose_move(Level, Player, Board, movement(OldLine, OldColumn, NewLine, NewColumn)).

% -- -- Predicate that checks whether there are moves the player can select

% -- -- -- Case where there are no moves available (skips turn)
checkValidMoves(_, [], movement(0, 0, 0, 0)).

% -- -- -- Case where there are available moves (asks the human to make a move)
checkValidMoves(Player, _, movement(OldLine, OldColumn, NewLine, NewColumn)) :-
    askPlayerMove(Player, OldLine, OldColumn, NewLine, NewColumn).


% -- Predicate that saves the game state, for the next cycle, and calculates the next player to play
saveState(Board) :-
    saveBoard(Board),
    changeTurn.

% </game state manipulation>

% <endgame procedures>

% predicado que determina se o jogo ja tem um vencedor, verificando
% as condicoes de vitoria:
% - apenas existem pecas de uma das cores
% - o tabuleiro esta completamente preenchido

% -- Predicate that determines whether the game already has a winner, checking
% -- the possible end conditions:
% -- - All pieces on the board belong to the same player
% -- - The board is completely full
game_over(Board, Winner) :-

    ((getMicrobeType('B', MicrobeB),
      boardEndCheck(MicrobeB, Board));
     
     (getMicrobeType('A', MicrobeA),
      boardEndCheck(MicrobeA, Board));

      boardEndCheck(' ', Board)),
    
    pointsA(A),
    pointsB(B),
    declareWinner(A, B, Winner).

% special game over checking function, to use in LAIG 3rd project
game_over_server(Board, PointsA, PointsB, Winner) :-

    ((getMicrobeType('B', MicrobeB),
      boardEndCheck(MicrobeB, Board));
     
     (getMicrobeType('A', MicrobeA),
      boardEndCheck(MicrobeA, Board));

      boardEndCheck(' ', Board)),
    
    declareWinner(PointsA, PointsB, Winner).

% -- Predicate that shows the winner of the game, and resets the game state so that
% -- a new game may be started
showWinnerAndReset(Winner) :-
    turn(Player),
    board(Board),
    display_game(Board, Player),
    showWinner(Winner),
    resetBoard,
    resetTurn,
    resetPoints,
    retractPlayerTypes,
    retractDifficulty.

% </endgame procedures>
