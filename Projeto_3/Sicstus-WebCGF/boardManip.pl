:- dynamic board/1, pointsA/1, pointsB/1, turn/1, playerType/2, difficulty/2.
:- consult('utility.pl').

% <initial state>

% -- Initial 7x7 board, to be modified as the game unfolds
board([[ b ,' ',' ',' ',' ',' ', a ],
       [' ',' ',' ',' ',' ',' ',' '],
       [' ',' ',' ',' ',' ',' ',' '],
       [' ',' ',' ',' ',' ',' ',' '],
       [' ',' ',' ',' ',' ',' ',' '],
       [' ',' ',' ',' ',' ',' ',' '],
       [ a ,' ',' ',' ',' ',' ', b ]]).

% -- Initial score
pointsA(2).
pointsB(2).

% -- Initial turn
turn('A').

% </initial state>

% <board setting>

% -- Removes board from memory
removeBoard(Board) :-
    retract(board(Board)).

% -- Saves board to memory
saveBoard(Board) :-
    assert(board(Board)).

% -- Function to reset the board, to be called at the start of each game
resetBoard :-
    removeBoard(_),
    saveBoard([[ b ,' ',' ',' ',' ',' ', a ],
               [' ',' ',' ',' ',' ',' ',' '],
               [' ',' ',' ',' ',' ',' ',' '],
               [' ',' ',' ',' ',' ',' ',' '],
               [' ',' ',' ',' ',' ',' ',' '],
               [' ',' ',' ',' ',' ',' ',' '],
               [ a ,' ',' ',' ',' ',' ', b ]]).

% </board setting>

% <score updating>

% -- Updates score of player A
changePointsA(NumPoints) :-
    retract(pointsA(_)),
    assert(pointsA(NumPoints)).

% -- Updates score of player B
changePointsB(NumPoints) :-
    retract(pointsB(_)),
    assert(pointsB(NumPoints)).

% </score updating>

% <turn advancement>

% -- Ends a player's turn and starts the other player's turn
changeTurn :-
    retract(turn(Player)),
    changeTurnAux(Player, NewPlayer),
    assert(turn(NewPlayer)).

% -- Auxiliary function to switch between the two players
changeTurnAux('A', 'B').
changeTurnAux('B', 'A').

% -- Gives the turn to player A, to be called at the start of the game
resetTurn :-
    retract(turn(_)),
    assert(turn('A')).

% </turn advancement>

% <player type setting>

% -- Predicate that, according to the menu option that was selected, adds
% -- predicates that state the type of players that will participate in
% -- the game

% -- -- Option 1 - Human v Human
setPlayerTypes(1) :-
    assert(playerType('A', 'H')),
    assert(playerType('B', 'H')).

% -- -- Option 2 - Human v Computer
setPlayerTypes(2) :-
    assert(playerType('A', 'H')),
    assert(playerType('B', 'C')).

% -- -- Option 3 - Computer v Computer
setPlayerTypes(3) :-
    assert(playerType('A', 'C')),
    assert(playerType('B', 'C')).

% -- Predicate that clears the player types so they can be set again
retractPlayerTypes :-
    retract(playerType('A', _)),
    retract(playerType('B', _)).

% </player type setting>

% <game difficulty setting>

% -- Predicate that sets the difficulty level of players A and B
assertDifficulty(DifficultyA, DifficultyB) :-
    assert(difficulty('A', DifficultyA)),
    assert(difficulty('B', DifficultyB)).

% -- Predicate that clears the saved difficulty levels of the players
retractDifficulty :-
    retract(difficulty('A', _)),
    retract(difficulty('B', _)).

% </game difficulty setting>

% <initial score setting>

% -- Predicate that resets the players' scores to the initial values
resetPoints :-
    retract(pointsA(_)),
    retract(pointsB(_)),
    assert(pointsA(2)),
    assert(pointsB(2)).

% </initial score setting>

% <player scores update>

% -- Predicate that receives a board, and iterates over all positions, counting the
% -- number of pieces of each type, to update the players' scores in the end
updatePointsNewBoard(Board) :-
    updatePoints(Board, 0, 0, PointsA, PointsB),
    changePointsA(PointsA),
    changePointsB(PointsB).

% -- End condition for the predicate, which iterates over the board
updatePoints([], CurrPointsA, CurrPointsB, CurrPointsA, CurrPointsB).

% -- Predicate that iterates over the board, updating the counted value of the pieces
% -- of each player, line by line
% -- [Line|Rest] - Head and Tail of the list of lines in the board
% -- CurrPointsA - Current count of points from player A
% -- CurrPointsB - Current count of points from player B
% -- PointsA - Field that will receive the final count of points from player A
% -- PointsB - Field that will receive the final count of points from player B
updatePoints([Line | Rest], CurrPointsA, CurrPointsB, PointsA, PointsB) :-
    updatePointsLine(Line, 0, 0, LinePointsA, LinePointsB),
    NewCurrPointsA is CurrPointsA + LinePointsA,
    NewCurrPointsB is CurrPointsB + LinePointsB,
    updatePoints(Rest, NewCurrPointsA, NewCurrPointsB, PointsA, PointsB).

% -- End condition for the predicate, which iterates over a line of the board
updatePointsLine([], CurrLinePointsA, CurrLinePointsB, CurrLinePointsA, CurrLinePointsB).

% -- Predicate that iterates over a line of the board, checking each position to update the
% -- count of pieces from each player
% -- [Pos|Rest] - Head and Tail of the line that is being processed
% -- CurrLinePointsA - Current count of points from player A in the line
% -- CurrLinePointsB - Current count of points from player B in the line
% -- LinePointsA - Field that will receive the final count of points from player A in the line
% -- LinePointsB - Field that will receive the final count of points from player B in the line

% -- -- Case where the board position has a piece from player A
updatePointsLine([Pos | Rest], CurrLinePointsA, CurrLinePointsB, LinePointsA, LinePointsB) :-
    Pos = a, NewCurrLinePointsA is CurrLinePointsA + 1, NewCurrLinePointsB is CurrLinePointsB,
    updatePointsLine(Rest, NewCurrLinePointsA, NewCurrLinePointsB, LinePointsA, LinePointsB).

% -- -- Case where the board position has a piece from player B
updatePointsLine([Pos | Rest], CurrLinePointsA, CurrLinePointsB, LinePointsA, LinePointsB) :-
    Pos = b, NewCurrLinePointsB is CurrLinePointsB + 1, NewCurrLinePointsA is CurrLinePointsA,
    updatePointsLine(Rest, NewCurrLinePointsA, NewCurrLinePointsB, LinePointsA, LinePointsB).

% -- -- Case where the board position is empty
updatePointsLine([Pos | Rest], CurrLinePointsA, CurrLinePointsB, LinePointsA, LinePointsB) :-
    Pos = ' ',
    updatePointsLine(Rest, CurrLinePointsA, CurrLinePointsB, LinePointsA, LinePointsB).
    
% </player scores update>

% <game move execution>

% -- Predicate that inserts a piece into a position on the board
% -- Line - line of the position where the piece will be inserted
% -- Column - column of the position where the piece will be inserted
% -- Microbe - Piece to be played in the position
% -- BoardIn - Board before the piece is played
% -- BoardOut - Board after the piece is played
playMicrobe(Line, Column, Microbe, BoardIn, BoardOut) :-
    updateLine(Line, Column, Microbe, BoardIn, BoardOut).

updateLine(1, Column, Microbe, [Line | More], [NewLine | More]) :-
    updateColumn(Column, Microbe, Line, NewLine).

updateLine(N, Column, Microbe, [Line | More], [Line | MoreLines]) :-
    N > 1,
    Next is N-1,
    updateLine(Next, Column, Microbe, More, MoreLines).

updateColumn(1, Microbe, [_ | Rest], [Microbe | Rest]).
updateColumn(N, Microbe, [P | Rest], [P | More]) :-
    N > 1,
    Next is N - 1,
    updateColumn(Next, Microbe, Rest, More).

% </game move execution>

% <board position query>

% -- Predicate that returns the piece in a said position on the board
% -- Line - line of the position to be queried
% -- Column - Column of the position to be queried
% -- Board - Board to be queried
% -- Microbe - Field that will receive the piece on the queried position
returnMicrobeInPos(Line, Column, Board, Microbe) :-
    analyzeLine(Line, Column, Board, Microbe).

% -- End condition for the predicate, which iterates over the board
analyzeLine(1, Column, [Line | _], Microbe) :-
    analyzeColumn(Column, Line, Microbe).

% -- Predicate that iterates over the board until it reaches the column to be queried
analyzeLine(N, Column, [_ | More], Microbe) :-
    N > 1,
    Next is N-1,
    analyzeLine(Next, Column, More, Microbe).

% -- End condition for the predicate, which iterates over a column
analyzeColumn(1, [Microbe | _], Microbe).

% -- Predicate that iterates over a column, until it reaches the position to be queried
analyzeColumn(N, [_ | Rest], Microbe) :-
    N > 1,
    Next is N - 1,
    analyzeColumn(Next, Rest, Microbe).

% </board position query>

% <microbe positions query>

% -- Predicate that returns values of line and column for positions
% -- containing the requested microbe type
getPositionsForMicrobe(Microbe, Board, Line, Column) :-
    getLineForMicrobe(Microbe, Board, 1, Line, Column).

% -- Predicate that iterates over the board, looking for lines where
% -- a microbe of the requested type is present

% -- -- Case where a microbe is found on the processed line
getLineForMicrobe(Microbe, [L | _], LineAux, LineAux, ColumnAux) :-
    LineAux < 8,
    getColumnForMicrobe(Microbe, L, 1, ColumnAux).

% -- -- Case where a microbe is not found on the processed line
getLineForMicrobe(Microbe, [_ | Rest], LineAux, Line, Column) :-
    LineAux < 8,
    NextLine is LineAux + 1,
    getLineForMicrobe(Microbe, Rest, NextLine, Line, Column).

% -- Predicate that iterates over a line, looking for positions where
% -- a microbe of the requested type is present

% -- -- Case where a microbe is found on the processed position
getColumnForMicrobe(Microbe, [Pos | _], ColumnAux, ColumnAux) :-
    ColumnAux < 8,
    Microbe = Pos.

% -- -- Case where a microbe is not found on the processed position
getColumnForMicrobe(Microbe, [_ | Rest], ColumnAux, Column) :-
    ColumnAux < 8,
    NextColumn is ColumnAux + 1,
    getColumnForMicrobe(Microbe, Rest, NextColumn, Column).

% </microbe positions query>
