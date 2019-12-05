:- consult('logic.pl').
:- use_module(library(lists)).

tabuleiroTeste(
    [
        [' ',' ',' ',' ',' ',' ',' '],
        [ a ,' ',' ',' ', a ,' ',' '],
        [' ',' ',' ',' ',' ',' ',' '],
        [' ', b ,' ', b , b ,' ',' '],
        [' ',' ',' ', b , b ,' ',' '],
        [ b ,' ', a , b , b ,' ',' '],
        [ b ,' ',' ', a , b , b , a ]
    ]
).

% tabuleiroTeste(
%     [
%         [ a , b , b ,' ',' ',' ',' '],
%         [ b , b , b ,' ',' ',' ',' '],
%         [ b , b , b ,' ',' ',' ',' '],
%         [' ',' ',' ',' ',' ',' ',' '],
%         [' ',' ',' ',' ',' ',' ',' '],
%         [' ',' ',' ',' ',' ',' ',' '],
%         [' ',' ',' ',' ',' ',' ',' ']
%     ]
% ).

% ---------------------------------------------------------------------
% funcoes de teste

jogaPecaTest(Linha, Coluna, Peca):-
    tabuleiroTeste(Tab),
    format("Antes:~n~n~n", []),
    display_game(Tab, 'A'),
    format("~n~n~n", []),
    playMicrobe(Linha, Coluna, Peca, Tab, TabOut),
    format("Depois:~n~n~n", []),
    display_game(TabOut, 'A'),
    format("~n~n~n", []).


analisaPecaTest(Linha, Coluna):-
    tabuleiroTeste(Tab),
    returnMicrobeInPos(Linha, Coluna, Tab, Peca),
    display_game(Tab, 'A'),
    format("~n~n~n", []),
    format("A peca na posicao e ~p.", [Peca]).


testPedeLinhaEColuna :-
    askLineAndColumn(Linha, Coluna),
    format("~n~nLinha: ~p; Coluna: ~p", [Linha, Coluna]).


testDisplayTab :-
    tabuleiroTeste(Tab),
    updatePointsNewBoard(Tab),
    display_game(Tab, 'A').


testAskMicrobeSelect :-
    tabuleiroTeste(Board),
    display_game(Board, 'A'),
    askMicrobeSelect('A', Board, Line, Column),
    format("~n~nLinha: ~p; Coluna: ~p", [Line, Column]).


testAskMicrobeMovement :-
    tabuleiroTeste(Board),
    display_game(Board, 'A'),
    askMicrobeMovement(Board, 4, 2, Line, Column),
    format("~n~nLinha: ~p; Coluna: ~p", [Line, Column]).

testEndGame :-
    tabuleiroTeste(Board),
    display_game(Board, 'A'),
    game_over(Board, Winner),
    format("~p ~n", [Winner]).

testUpdatePoints :-
    tabuleiroTeste(Board),
    display_game(Board, 'A'),
    format("~n~n", []),
    updatePointsNewBoard(Board),
    display_game(Board, 'A').

testMove :-
    tabuleiroTeste(Board),
    display_game(Board, 'A'),
    askPlayerMove('A', OldLine, OldColumn, NewLine, NewColumn),
    move('A', OldLine, OldColumn, NewLine, NewColumn, Board, NewBoard),
    format("~n~n", []),
    display_game(NewBoard, 'B').

testMoveValueRand :-
    tabuleiroTeste(Board),
    display_game(Board, 'A'),
    value(1, Board, 'A', ValueA),
    value(1, Board, 'B', ValueB),
    format("~nBoard value for ~s = ~p~nBoard value for ~s = ~p~n~n", ['A', ValueA, 'B', ValueB]).

testMoveValueSmart :-
    tabuleiroTeste(Board),
    display_game(Board, 'A'),
    value(2, Board, 'A', ValueA),
    value(2, Board, 'B', ValueB),
    format("~nBoard value for ~s = ~p~nBoard value for ~s = ~p~n~n", ['A', ValueA, 'B', ValueB]).

testContaminateAdjacent :-
    tabuleiroTeste(Board),
    display_game(Board, 'A'),
    contaminateAdjacent('A', 4, 2, Board, NewBoard),
    format("~n~n", []),
    display_game(NewBoard, 'B').

testGetPositions :-
    tabuleiroTeste(Board),
    display_game(Board, 'A'),
    getPositionsForMicrobe(a, Board, _, _).

testValidMoves :-
    tabuleiroTeste(Board),
    valid_moves('A', Board, ListOfValidMoves),
    length(ListOfValidMoves, Length),
    format("~n~n Valid moves: ~p~n~n", [Length]).


testChooseMove(Level) :-
    tabuleiroTeste(Board),
    display_game(Board, 'B'),
    choose_move(Level, 'B', Board, NewBoard),
    format("~nChoosing play . . .~n~n", []),
    display_game(NewBoard, 'B').


testValidMovesUser(OldLine, OldColumn) :-
    tabuleiroTeste(Board),
    display_game(Board, 'A'),
    valid_moves_user('A', Board, OldLine, OldColumn, ListOfValidMoves),
    length(ListOfValidMoves, Length),
    format("~n~n Valid moves: ~p~n~n", [Length]).
