let squares = document.getElementsByClassName(`square`)
let messageParagraph = document.getElementById(`messageParagraph`)
let xParagraph = document.getElementById(`xParagraph`)
let oParagraph = document.getElementById(`oParagraph`)
let restartButton = document.getElementById(`restartButton`)
let switchButton = document.getElementById(`switchButton`)

let ai = `O`
let turn = `X`
let gameOver = false

for (let square of squares) {
  square.addEventListener(`click`, clickSquare)
}

restartButton.addEventListener(`click`, restart)
switchButton.addEventListener(`click`, switchLetters)

function clickSquare() {
  if (this.innerHTML == `` && turn != ai && !gameOver) {
    this.innerHTML = turn
    switchTurn()
  }
}

function switchTurn() {
  let board = getBoard()

  if (threeInRow(board, turn)) {
    messageParagraph.innerHTML = `${turn} wins!`
    gameOver = true
  }
  else if (boardIsFull(board)) {
    messageParagraph.innerHTML = `Tie game`
    gameOver = true
  }
  else {
    turn = turn == `X` ? `O` : `X`

    if (turn == ai) {
      setTimeout(aiMove, 10)
    }
  }
}

function aiMove() {
  let highestScore = -Infinity
  let squareIndexes

  let board = getBoard()
  let nextBoards = getNextBoards(board, turn)

  for (let nextBoard of nextBoards) {
    let score = getScore(nextBoard, turn, true)
    let squareIndex = getSquareIndex(board, nextBoard)

    if (score > highestScore) {
      highestScore = score
      squareIndexes = [squareIndex]
    }
    else if (score == highestScore) {
      squareIndexes.push(squareIndex)
    }
  }

  let squareIndex = squareIndexes[Math.floor(Math.random() * squareIndexes.length)]
  squares[squareIndex].innerHTML = turn
  switchTurn()
}

function getScore(board, currentTurn, aiTurn) {
  if (threeInRow(board, currentTurn)) {
    return aiTurn ? 1 : -1
  }
  else if (boardIsFull(board)) {
    return 0
  }
  else {
    let nextTurn = currentTurn == `X` ? `O` : `X`
    let nextBoards = getNextBoards(board, nextTurn)

    if (aiTurn) {
      let strongestScore = Infinity

      for (let nextBoard of nextBoards) {
        let score = getScore(nextBoard, nextTurn, false)
        strongestScore = Math.min(score, strongestScore)
      }

      return strongestScore
    }
    else {
      let strongestScore = -Infinity

      for (let nextBoard of nextBoards) {
        let score = getScore(nextBoard, nextTurn, true)
        strongestScore = Math.max(score, strongestScore)
      }

      return strongestScore
    }
  }
}

function getBoard() {
  let board = []

  for (let square of squares) {
    board.push(square.innerHTML)
  }

  return board
}

function getNextBoards(board, currentTurn) {
  let nextBoards = []

  for (let i = 0; i < board.length; i++) {
    if (board[i] == ``) {
      let boardCopy = board.slice()
      boardCopy[i] = currentTurn

      nextBoards.push(boardCopy)
    }
  }

  return nextBoards
}

function getSquareIndex(board1, board2) {
  for (let i = 0; i < board1.length; i++) {
    if (board1[i] != board2[i]) {
      return i
    }
  }

  return -1
}

function restart() {
  turn = `X`
  gameOver = false

  for (let square of squares) {
    square.innerHTML = ``
  }

  messageParagraph.innerHTML = ``

  if (turn == ai) {
    setTimeout(aiMove, 10)
  }
}

function switchLetters() {
  ai = ai == `X` ? `O` : `X`

  if (ai == `X`) {
    xParagraph.innerHTML = `Computer is X`
    oParagraph.innerHTML = `You are O`
    switchButton.innerHTML = `Let yourself go first`
  }
  else {
    xParagraph.innerHTML = `You are X`
    oParagraph.innerHTML = `Computer is O`
    switchButton.innerHTML = `Let computer go first`  
  }

  restart()
}

function threeInRow(board, currentTurn) {
  if (board[0] == currentTurn && board[1] == currentTurn && board[2] == currentTurn) {
    return true
  }
  else if (board[3] == currentTurn && board[4] == currentTurn && board[5] == currentTurn) {
    return true
  }
  else if (board[6] == currentTurn && board[7] == currentTurn && board[8] == currentTurn) {
    return true
  }
  else if (board[0] == currentTurn && board[3] == currentTurn && board[6] == currentTurn) {
    return true
  }
  else if (board[1] == currentTurn && board[4] == currentTurn && board[7] == currentTurn) {
    return true
  }
  else if (board[2] == currentTurn && board[5] == currentTurn && board[8] == currentTurn) {
    return true
  }
  else if (board[0] == currentTurn && board[4] == currentTurn && board[8] == currentTurn) {
    return true
  }
  else if (board[2] == currentTurn && board[4] == currentTurn && board[6] == currentTurn) {
    return true
  }

  return false
}

function boardIsFull(board) {
  for (let cell of board) {
    if (cell == ``) {
      return false
    }
  }

  return true
}