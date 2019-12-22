
% <game state representation>

% -- Predicate that displays the board, as well as each player's score, and
% -- who's turn it is to play
display_game(Board, Player) :-
    pointsA(PointsA),
    pointsB(PointsB),
    format("----------------------------------------------~n~n", []),
    printBoard(Board),
    nl,
    format("          Player A         Player B           ~n", []),
    format("            ~p                ~p              ~n",
           [PointsA, PointsB]),
    nl,
    format("           It is player ~ps turn.             ~n",
           [Player]),
    format("----------------------------------------------~n", []).

% -- Predicate that prints the current state of the board
printBoard(Board) :-
    format("       ----------------------------------------- ~n", []),
    format("      |  1  |  2  |  3  |  4  |  5  |  6  |  7  |~n", []),
    format("|-----|-----|-----|-----|-----|-----|-----|-----|~n", []),
    printBoardLine(1, Board).

% -- End condition for the predicate, which iterates over the board's lines
printBoardLine(_, []).

% -- Predicate that iterates over the board's lines, displaying each of them
printBoardLine(NumLine, [X | RestLines]) :-
    format("|  ~d  |", [NumLine]),
    format("  ~p  |  ~p  |  ~p  |  ~p  |  ~p  |  ~p  |  ~p  |~n", X),
    format("|-----|-----|-----|-----|-----|-----|-----|-----|~n", []),
    NewNumLine is NumLine + 1,
    printBoardLine(NewNumLine, RestLines).

% </game state representation>

% <menu screens representation>

% -- Predicate that displays the main menu, showing the options available to the user
printMenu :-
    format("   ____________         __________   ___     ___   __________   __________   __________   ~n", []),
    format("   \\_______   / TH     /  _______/  /  /    /  /  /  _______/  /  _______/  /___   ___/   ~n", []),
    format("          /  /        /  /   ___   /  /    /  /  /  /____     /  /____         /  /       ~n", []),
    format("         /  /        /  /   /  /  /  /    /  /  /  _____/     \\_____  \\       /  /        ~n", []),
    format("        /  /        /  /___/  /  /  /____/  /  /  /______   _______/  /      /  /         ~n", []),
    format("       /__/         \\________/   \\_________/   \\________/  /_________/      /__/          ~n~n", []),
    format("                                     I N F E C T I O N                                    ~n~n", []),
    format("Please choose one of the following game options:~n~n", []),
    format("1: Human / Human~n~n", []),
    format("2: Human / Computer~n~n", []),
    format("3: Computer / Computer~n~n", []).

% -- Predicate that displays the difficulty selection menu, showing the options available to the user
printDifficultyMenu(Player) :-
    format("-----------------------------------------------------~n~n", []),
    format("Please choose a difficulty for the computer (Player ~p):~n~n", [Player]),
    format("-----------------------------------------------------~n~n", []),
    format("1: Easy~n~n", []),
    format("2: Medium~n~n", []).

% </menu screens representation>

% <endgame procedures>

% -- Predicate that displays the winner of the game, when it reaches its end

% -- -- Case where one of the players wins the game
showWinner(Winner) :-
    Winner \= 'draw',
    format("-----------------------------------------------------~n~n", []),
    format("     CONGRATS Player ~p! You are the winner!         ~n~n", [Winner]),
    format("-----------------------------------------------------~n~n", []).

% -- -- Case where the game ends in a draw
showWinner(Winner) :-
    Winner = 'draw',
    format("-----------------------------------------------------~n~n", []),
    format("               The game ends in a draw!              ~n~n", []),
    format("-----------------------------------------------------~n~n", []).

% </endgame procedures>

% <move validation prompts>

% -- Predicate that informs the player that they've chosen an invalid move
printInvalidMove :-
    format("~nThe move chosen by the player is invalid. Please choose another move.~n~n", []).


% -- Predicate that informs that a player has no available moves, and that their turn will be skipped
printNoValidMoves :-
    format("~nThere are no valid moves for this player. The turn will be passed to the other player.~n~n", []).

% </move validation prompts>
