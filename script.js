var squares = document.querySelectorAll(".square");
var message = document.getElementById("message");
var x = document.getElementById("x");
var o = document.getElementById("o");
var restartButton = document.getElementById("restart");
var switchButton = document.getElementById("switch");

var ai = "O";
var turn = "X";
var gameOver = false;

for (var i = 0; i < 9; i++) {
    squares[i].addEventListener("click", clickSquare);
}

restartButton.addEventListener("click", restart);
switchButton.addEventListener("click", switchLetters);

function clickSquare() {
    if (turn != ai && !gameOver && this.innerHTML == "") {
        this.innerHTML = turn;
        turn = turn == "X" ? "O" : "X";

        checkGameOver();

        if (!gameOver) {
            setTimeout(aiPlaceLetter, 10);
        }
    }
}

function restart() {
    turn = "X";
    gameOver = false;

    for (var i = 0; i < 9; i++) {
        squares[i].innerHTML = "";
    }

    message.innerHTML = "";

    if (ai == turn) {
        setTimeout(aiPlaceLetter, 10);
    }
}

function switchLetters() {
    ai = ai == "X" ? "O" : "X";
    x.innerHTML = ai == "X" ? "Computer is X" : "You are X";
    o.innerHTML = ai == "O" ? "Computer is O" : "You are O";
    switchButton.innerHTML = ai == "X" ? "Let yourself go first" : "Let computer go first";

    restart();
}

function checkGameOver() {
    var board = getBoard();

    if (threeInRow(board, "X")) {
        gameOver = true;
        message.innerHTML = "X wins!";
    }
    else if (threeInRow(board, "O")) {
        gameOver = true;
        message.innerHTML = "O wins!";
    }
    else if (boardIsFull(board)) {
        gameOver = true;
        message.innerHTML = "Tie game";
    }
}

function threeInRow(board, letter) {
    if (board[0] == letter && board[1] == letter && board[2] == letter) {
        return true;
    }
    else if (board[3] == letter && board[4] == letter && board[5] == letter) {
        return true;
    }
    else if (board[6] == letter && board[7] == letter && board[8] == letter) {
        return true;
    }
    else if (board[0] == letter && board[3] == letter && board[6] == letter) {
        return true;
    }
    else if (board[1] == letter && board[4] == letter && board[7] == letter) {
        return true;
    }
    else if (board[2] == letter && board[5] == letter && board[8] == letter) {
        return true;
    }
    else if (board[0] == letter && board[4] == letter && board[8] == letter) {
        return true;
    }
    else if (board[2] == letter && board[4] == letter && board[6] == letter) {
        return true;
    }

    return false;
}

function boardIsFull(board) {
    for (var i = 0; i < board.length; i++) {
        if (board[i] == "") {
            return false;
        }
    }

    return true;
}

function aiPlaceLetter() {
    var selectedSquareIndex = null;
    var board = getBoard();

    if (boardIsEmpty(board)) {
        selectedSquareIndex = 4;
    }
    else {
        var highestScore = -Infinity;
        var highestScoreIndexes = [];
        var nextBoards = getNextBoards(board, turn == "X" ? "O" : "X");

        for (var i = 0; i < nextBoards.length; i++) {
            var score = getScore(nextBoards[i], turn, true);

            if (score > highestScore) {
                highestScore = score;
                highestScoreIndexes = [i];
            }
            else if (score == highestScore) {
                highestScoreIndexes.push(i);
            }
        }

        var squareIndexes = [];

        for (var i = 0; i < highestScoreIndexes.length; i++) {
            var squareIndex = getSquareIndex(board, nextBoards[highestScoreIndexes[i]]);
            squareIndexes.push(squareIndex);

            if (squareIndex == 4) {
                selectedSquareIndex = 4;
            }
        }

        if (selectedSquareIndex == null) {
            selectedSquareIndex = squareIndexes[Math.floor(Math.random() * squareIndexes.length)];
        }
    }

    squares[selectedSquareIndex].innerHTML = turn;
    turn = turn == "X" ? "O" : "X";

    checkGameOver();
}

function getBoard() {
    var board = [];

    for (var i = 0; i < 9; i++) {
        board.push(squares[i].innerHTML);
    }

    return board;
}

function boardIsEmpty(board) {
    for (var i = 0; i < 9; i++) {
        if (board[i] != "") {
            return false;
        }
    }

    return true;
}

function getNextBoards(board, turn) {
    var nextBoards = [];
    var nextTurn = turn == "X" ? "O" : "X";

    for (var i = 0; i < 9; i++) {
        var nextBoard = board.slice();

        if (nextBoard[i] == "") {
            nextBoard[i] = nextTurn;
            nextBoards.push(nextBoard);
        }
    }

    return nextBoards;
}

function getSquareIndex(board1, board2) {
    for (var i = 0; i < 9; i++) {
        if (board1[i] != board2[i]) {
            return i;
        }
    }

    return -1;
}

function getScore(board, turn, aiMove) {
    if (threeInRow(board, "X")) {
        return turn == "X" ? (aiMove ? 1 : -1) : (aiMove ? -1 : 1);
    }
    else if (threeInRow(board, "O")) {
        return turn == "O" ? (aiMove ? 1 : -1) : (aiMove ? -1 : 1);
    }
    else if (boardIsFull(board)) {
        return 0;
    }
    else {
        var nextBoards = getNextBoards(board, turn);
        var nextTurn = turn == "X" ? "O" : "X";

        var score;
        var strongestScore;

        if (aiMove) {
            strongestScore = Infinity;

            for (var i = 0; i < nextBoards.length; i++) {
                score = getScore(nextBoards[i], nextTurn, false);
                strongestScore = Math.min(score, strongestScore);
            }

            return strongestScore;
        }
        else {
            strongestScore = -Infinity;

            for (var i = 0; i < nextBoards.length; i++) {
                score = getScore(nextBoards[i], nextTurn, true);
                strongestScore = Math.max(score, strongestScore);
            }

            return strongestScore;
        }
    }
}
