:- consult('input.pl').
:- use_module(library(random)).

% <move execution>

% -- Predicate that validates and executes a proposed play
% -- Player - player who requested the move (important to know the type of piece to move)
% -- OldLine - Line of the position of the microbe that should be moved
% -- OldColumn - Column of the position of the microbe that should be moved
% -- NewLine - Line of the position to which the microbe should be moved
% -- NewColumn - Column of the position to which the microbe should be moved
% -- Board - board that represents the game state before the move
% -- NewBoard - board where the changes to the game state are represented
move(Player, OldLine, OldColumn, NewLine, NewColumn, Board, NewBoard) :-
    getMicrobeType(Player, MicrobeType),
    checkValidMove(MicrobeType, OldLine, OldColumn, NewLine, NewColumn, Board, IsAdjacent),
    playMicrobe(NewLine, NewColumn, MicrobeType, Board, BoardOut),
    handleIsAdjacent(IsAdjacent, OldLine, OldColumn, BoardOut, BoardOut2),
    contaminateAdjacent(Player, NewLine, NewColumn, BoardOut2, NewBoard).

% -- Predicate that distinguishes moves to adjacent positions, for the application of the special
% -- rules for this kind of moves

% -- -- Case where the move is executed towards a non-adjacent position
handleIsAdjacent('no', OldLine, OldColumn, BoardIn, BoardOut) :-
    playMicrobe(OldLine, OldColumn, ' ', BoardIn, BoardOut).

% -- -- Case where the move is executed towards an adjacent position
handleIsAdjacent('yes', _, _, Board, Board).

% </move execution>

% <enemy piece contamination>

% -- Predicate that, given the position of the newly set piece, contaminates the
% -- adjacent enemy pieces
contaminateAdjacent(Player, Line, Column, Board, NewBoard) :-
    getMicrobeType(Player, MicrobeType),
    AuxLine1 is Line - 1, AuxCol1 is Column - 1, contaminatePosition(MicrobeType, AuxLine1, AuxCol1, Board, BoardAux1),
    AuxLine2 is Line - 1, AuxCol2 is Column, contaminatePosition(MicrobeType, AuxLine2, AuxCol2, BoardAux1, BoardAux2),
    AuxLine3 is Line - 1, AuxCol3 is Column + 1, contaminatePosition(MicrobeType, AuxLine3, AuxCol3, BoardAux2, BoardAux3),
    AuxLine4 is Line, AuxCol4 is Column - 1, contaminatePosition(MicrobeType, AuxLine4, AuxCol4, BoardAux3, BoardAux4),
    AuxLine5 is Line, AuxCol5 is Column + 1, contaminatePosition(MicrobeType, AuxLine5, AuxCol5, BoardAux4, BoardAux5),
    AuxLine6 is Line + 1, AuxCol6 is Column - 1, contaminatePosition(MicrobeType, AuxLine6, AuxCol6, BoardAux5, BoardAux6),
    AuxLine7 is Line + 1, AuxCol7 is Column, contaminatePosition(MicrobeType, AuxLine7, AuxCol7, BoardAux6, BoardAux7),
    AuxLine8 is Line + 1, AuxCol8 is Column + 1, contaminatePosition(MicrobeType, AuxLine8, AuxCol8, BoardAux7, NewBoard).

% -- Predicate that contaminates a position of the board, if it belongs to the
% -- opposing player
% -- -- Case where the position will be contaminated
contaminatePosition(MicrobeType, Line, Column, Board, NewBoard) :-
    Line > 0, Line < 8,
    Column > 0, Column < 8,
    returnMicrobeInPos(Line, Column, Board, Microbe),
    Microbe \= MicrobeType, Microbe \= ' ',
    playMicrobe(Line, Column, MicrobeType, Board, NewBoard).

% -- -- Case where the position will not be contaminated
contaminatePosition(_, _, _, Board, Board).

% </enemy piece contamination>

% <endgame procedures>

% -- Predicate that determines the winner, depending on the scores of both players

% -- -- Case where player A has a higher score
declareWinner(A, B, Winner) :-
    A > B,
    Winner = 'A'.

% -- -- Case where player B has a higher score
declareWinner(A, B, Winner) :-
    B > A,
    Winner = 'B'.

% -- -- Case where the players have equal scores
declareWinner(A, B, Winner) :-
    A =:= B,
    Winner = 'draw'.

% -- End condition for the predicate, which iterates over the board
boardEndCheck(_, []).

% -- Predicate that iterates over the board, returning false if a piece of the
% -- type P is found
boardEndCheck(P, [Line | Rest]) :-
    boardLineEndCheck(P, Line),
    boardEndCheck(P, Rest).

% -- End condition for the predicate, which iterates over a line of the board
boardLineEndCheck(_, []).

% -- Predicate that iterates over a line of the board, returning false if a piece
% -- of the type P is found
boardLineEndCheck(P, [Head | Tail]) :-
    Head \= P,
    boardLineEndCheck(P, Tail).

% </endgame procedures>

% <move evaluation>

% -- Predicate that evaluates the game state, returning a value to
% -- characterize it; only used when the difficulty is set to level 2 (medium):
% -- -- move's value is equal to the piece advantage of the player who executes
% -- -- the move (value can be negative!)
value(Board, Player, Value) :-
    updatePoints(Board, 0, 0, PointsA, PointsB),
    valueAux(Player, Value, PointsA, PointsB).

% -- Predicate that calculates the value of the play, based on the number of
% -- pieces on the board from each player

% -- -- Case where player A executes the move
valueAux('A', Value, PointsA, PointsB) :-
    Value is PointsA-PointsB.

% -- -- Case where player B executes the move
valueAux('B', Value, PointsA, PointsB) :-
    Value is PointsB-PointsA.

% </move evaluation>

% <cpu move generation>

% -- Predicate that, using findall() with the findMove() predicate, generates
% -- all possible moves available to the player, returning them in a list
valid_moves(Player, Board, ListOfValidMoves) :-
    findall(OldLine-OldColumn-NewLine-NewColumn,
            findMove(Player, Board, OldLine,
                     OldColumn, NewLine, NewColumn),
            ListOfValidMoves).

% -- Predicate to be used by the Computer, which generates a possible move
% -- according to the board state
% -- Player - the player for which the move is generated
% -- Board - current state of the board
% -- OldLine - line of the microbe to be moved
% -- OldColumn - column of the microbe to be moved
% -- NewLine - line that the microbe should be moved to
% -- NewColumn - column that the microbe should be moved to
findMove(Player, Board, OldLine, OldColumn, NewLine, NewColumn) :-
    getMicrobeType(Player, MicrobeType),
    getPositionsForMicrobe(MicrobeType, Board, OldLine, OldColumn),
    generateValidPosition(OldLine, OldColumn, NewLine, NewColumn),
    once(checkValidMove(MicrobeType, OldLine, OldColumn,
                        NewLine, NewColumn, Board, _)).

generateValidPosition(Line, Column, LineOut, ColumnOut) :-
    LineOut is Line - 2, ColumnOut is Column - 2.

generateValidPosition(Line, Column, LineOut, ColumnOut) :-
    LineOut is Line - 2, ColumnOut is Column.

generateValidPosition(Line, Column, LineOut, ColumnOut) :-
    LineOut is Line - 2, ColumnOut is Column + 2.

generateValidPosition(Line, Column, LineOut, ColumnOut) :-
    LineOut is Line - 1, ColumnOut is Column - 1.

generateValidPosition(Line, Column, LineOut, ColumnOut) :-
    LineOut is Line - 1, ColumnOut is Column.

generateValidPosition(Line, Column, LineOut, ColumnOut) :-
    LineOut is Line - 1, ColumnOut is Column + 1.

generateValidPosition(Line, Column, LineOut, ColumnOut) :-
    LineOut is Line, ColumnOut is Column - 2.

generateValidPosition(Line, Column, LineOut, ColumnOut) :-
    LineOut is Line, ColumnOut is Column - 1.

generateValidPosition(Line, Column, LineOut, ColumnOut) :-
    LineOut is Line, ColumnOut is Column + 1.

generateValidPosition(Line, Column, LineOut, ColumnOut) :-
    LineOut is Line, ColumnOut is Column + 2.

generateValidPosition(Line, Column, LineOut, ColumnOut) :-
    LineOut is Line + 1, ColumnOut is Column - 1.

generateValidPosition(Line, Column, LineOut, ColumnOut) :-
    LineOut is Line + 1, ColumnOut is Column.

generateValidPosition(Line, Column, LineOut, ColumnOut) :-
    LineOut is Line + 1, ColumnOut is Column + 1.

generateValidPosition(Line, Column, LineOut, ColumnOut) :-
    LineOut is Line + 2, ColumnOut is Column - 2.

generateValidPosition(Line, Column, LineOut, ColumnOut) :-
    LineOut is Line + 2, ColumnOut is Column.

generateValidPosition(Line, Column, LineOut, ColumnOut) :-
    LineOut is Line + 2, ColumnOut is Column + 2.

% </cpu move generation>


% <user move generation>

% -- Predicate that, using findall() with the findMove() predicate, generates
% -- all possible moves available to the player, returning them in a list
% -- (assumes OldLine and OldColumn are valid, that is, that there is a user microbe in that position)
valid_moves_user(Player, Board, OldLine, OldColumn, ListOfValidMoves) :-
    findall(NewLine-NewColumn,
            findMoveUser(Player, Board, OldLine,
                     OldColumn, NewLine, NewColumn),
            ListOfValidMoves).

% -- Predicate to be used by the User, which generates a possible move
% -- according to the board state
% -- Player - the player for which the move is generated
findMoveUser(Player, Board, OldLine, OldColumn, NewLine, NewColumn) :-
    generateValidPosition(OldLine, OldColumn, NewLine, NewColumn),
    once(checkValidMove(MicrobeType, OldLine, OldColumn,
                    NewLine, NewColumn, Board, _)).


% </user move generation>


% <cpu move selection>

% -- Predicate to be used by the Computer, that creates all possible
% -- scenarios and chooses, according to the difficulty level, the best
% -- possible move
choose_move(Level, Player, Board, 
            movement(OldLine, OldColumn, NewLine, NewColumn)) :-
    valid_moves(Player, Board, ListOfValidMoves),
    chooseBestMove(Level, ListOfValidMoves, Player, Board, 
                   movement(OldLine, OldColumn, NewLine, NewColumn)).

% -- Predicate that receives a list with all possible moves and, according to
% -- the difficulty level, calls the value() predicate for each move,
% -- returning in BestMove the most advantageous move
% -- If there are no available moves, the move returned is (0, 0, 0, 0), and
% -- the turn is skipped
% -- Level - difficulty level according to which the moves will be evaluated
% -- ListOfValidMoves - list containing each possible move
% -- Player - player for which the moves are being computed
% -- Board - board that represents the game state before any move is executed
% -- BestMove - the most advantageous move
chooseBestMove(Level, ListOfValidMoves, Player, Board, 
               movement(OldLine, OldColumn, NewLine, NewColumn)) :-
    chooseBestMoveAux(Level, ListOfValidMoves, Player, -999999, Board,
                      movement(0, 0, 0, 0),
                      movement(OldLine, OldColumn, NewLine, NewColumn)).

% -- End condition for the predicate, which iterates over the list of
% -- possible moves
chooseBestMoveAux(_, [], _, _, _, 
                  movement(OldLine, OldColumn, NewLine, NewColumn),
                  movement(OldLine, OldColumn, NewLine, NewColumn)).

% -- Predicate that iterates over the list of possible moves, checking if the
% -- current move is better than the previous best option, and returning the
% -- best move available in the end
% -- Level - difficulty level to be passed to the value() predicate
% -- [CurOldLine-CurOldColumn-CurNewLine-CurNewColumn | Rest] - 
% --  -  Head and Tail of the list of possible moves
% -- Player - player for which the moves' value will be calculated
% -- AuxValue - variable that will store the best value obtained at any point 
% --            during the iteration of the list
% -- movement(AuxOldLine, AuxOldColumn, AuxNewLine, AuxNewColumn) - 
% --  -  variable that will store the move for which the value is highest at 
% --     any point during the iteration of the list
% -- movement(OldLine, OldColumn, NewLine, NewColumn) - field that will be 
% -- returned with the move for which the value is highest in the list

% -- Level 1
chooseBestMoveAux(1, [CurOldLine-CurOldColumn-CurNewLine-CurNewColumn | Rest],
                  Player, AuxValue, Board,
                  movement(AuxOldLine, AuxOldColumn, AuxNewLine, AuxNewColumn),
                  movement(OldLine, OldColumn, NewLine, NewColumn)) :-
    random(0, 100, Value),
    Value > AuxValue -> 
    chooseBestMoveAux(1, Rest, Player, Value, Board, 
                      movement(CurOldLine, CurOldColumn,
                               CurNewLine, CurNewColumn),
                      movement(OldLine, OldColumn,
                               NewLine, NewColumn));
    chooseBestMoveAux(1, Rest, Player, AuxValue, Board,
                      movement(AuxOldLine, AuxOldColumn,
                               AuxNewLine, AuxNewColumn),
                      movement(OldLine, OldColumn,
                               NewLine, NewColumn)).

% -- Level 2
chooseBestMoveAux(2, [CurOldLine-CurOldColumn-CurNewLine-CurNewColumn | Rest],
                  Player, AuxValue, Board, 
                  movement(AuxOldLine, AuxOldColumn, AuxNewLine, AuxNewColumn),
                  movement(OldLine, OldColumn, NewLine, NewColumn)) :-
    move(Player, CurOldLine, CurOldColumn, CurNewLine,
         CurNewColumn, Board, AuxBoard),
    value(AuxBoard, Player, Value),
    Value > AuxValue -> 
    chooseBestMoveAux(2, Rest, Player, Value, Board, 
                      movement(CurOldLine, CurOldColumn,
                               CurNewLine, CurNewColumn),
                      movement(OldLine, OldColumn,
                               NewLine, NewColumn));
    chooseBestMoveAux(2, Rest, Player, AuxValue, Board,
                      movement(AuxOldLine, AuxOldColumn,
                               AuxNewLine, AuxNewColumn),
                      movement(OldLine, OldColumn,
                               NewLine, NewColumn)).

% </cpu move selection>
