:- consult('mainCycle.pl').

% <game cycle>

% Main predicate that controls the flow of the game, updating
% it as both players choose their moves until a winner is
% determined
play :-
    startGame,
    repeat,  
        once(getState(Board)),
        once(changeState(Board, NewBoard)),
        once(saveState(NewBoard)),
    game_over(NewBoard, Winner),
    showWinnerAndReset(Winner).

% </game cycle>
