:- consult('boardManip.pl').
:- consult('print.pl').

% <user integer input reading>

% -- Predicate that issues a prompt to the player, and then reads an
% -- integer value
readInt(Prompt, Number) :-
    write(Prompt), write('> '),
    getNumberFromUser(Number).

% -- Predicate that reads a number from the user
getNumberFromUser(Number) :-
    get_code(Ch),
    once(getChars(Ch, Total)),
    name(Number, Total).

getChars(10, []).
getChars(13, []).
getChars(Ch, [Ch | More]) :-
    get_code(Ch1),
    getChars(Ch1, More).

% </user integer input reading>

% <user play selection reading>

% -- Predicate that queries the player for what move to execute.
% -- OldLine and OldColumn refer to the position of the microbe that should be moved
% -- NewLine and NewColumn refer to the position to where the microbe should move
askPlayerMove(Player, OldLine, OldColumn, NewLine, NewColumn) :-
    format("Player ~p, please select a microbe to move.~n~n", [Player]),
    askLineAndColumn(OldLine, OldColumn),
    format("~n~nPlease select a new position for that microbe.~n~n", []),
    askLineAndColumn(NewLine, NewColumn),
    format("~n~n", []).

% -- Predicate that reads a position from the user's input
% -- Line and Column are both returned by the predicate
askLineAndColumn(Line, Column) :-
    readInt('Insert the number of a line (1 to 7) ', LineIn),
    readInt('Insert the number of a column (1 to 7) ', ColumnIn),
    verifyLineAndColumn(LineIn, ColumnIn, Line, Column).

% -- Verifies that the position given by the player exists on the board
% -- The first two values are the ones input by the user

% -- -- Case where the given values are valid
verifyLineAndColumn(LineIn, ColumnIn, LineIn, ColumnIn) :-
    integer(LineIn), integer(ColumnIn),
    LineIn > 0, LineIn < 8,
    ColumnIn > 0, ColumnIn < 8.

% -- -- Case where the given values are not valid
verifyLineAndColumn(_, _, Line, Column) :-
    format("~n~nInvalid inputs. Please, try again.~n~n", []),
    readInt('Insert the number of a line (1 to 7) ', NewLineIn),
    readInt('Insert the number of a column (1 to 7) ', NewColumnIn),
    verifyLineAndColumn(NewLineIn, NewColumnIn, Line, Column).

% </user play selection reading>

% <user menu selection reading>

% -- Predicate that queries the user for an integer between the given values
% -- (inclusive), each possible number corresponding to a menu option
askBetweenValues(Option, Value1, Value2) :-
    readInt('Option ', OptionIn),
    verifyMenuOption(OptionIn, Option, Value1, Value2).

% -- Predicate that validates the option chosen by the player

% -- -- Case where the option is valid
verifyMenuOption(OptionIn, OptionIn, Value1, Value2) :-
    integer(OptionIn),
    OptionIn >= Value1, OptionIn =< Value2.

% -- -- Case where the option is not valid
verifyMenuOption(_, Option, Value1, Value2) :-
    format("~n~nInvalid inputs. Please, try again.~n~n", []),
    readInt('Option ', NewOptionIn),
    verifyMenuOption(NewOptionIn, Option, Value1, Value2).

% </user menu selection reading>

% <user difficulty selection reading>

% -- Predicate that reads, and asserts, the difficulties of each player,
% -- according to user input

% -- -- Case where the game will occur between two Human players (the
% -- -- difficulty does not matter in this case, but still needs to be
% -- -- asserted, so it can later be retracted with no problem)
askDifficulty(1) :-
    assertDifficulty(1, 1).

% -- -- Case where the game will occur between a Human player and the Computer
% -- -- Only the difficulty of player B matters, but both must be asserted
askDifficulty(2) :-
    printDifficultyMenu('B'),
    askBetweenValues(Difficulty, 1, 2),
    assertDifficulty(1, Difficulty).

% -- -- Case where the game will occur between two Computer controlled players
% -- -- In this case both difficulty levels matter
askDifficulty(3) :-
    printDifficultyMenu('A'),
    askBetweenValues(DifficultyA, 1, 2),
    printDifficultyMenu('B'),
    askBetweenValues(DifficultyB, 1, 2),
    assertDifficulty(DifficultyA, DifficultyB).

% </user difficulty selection reading>
