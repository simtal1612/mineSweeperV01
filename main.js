'use strict'

const LEVEL = [4, 8, 12]
const MINES = [2, 14, 32]
const MINE = '💣'
const FLAG = '🚩'
var gBoard
var gLevel
var gGame
var gDate
var gTimer
var gFirstClick = true
var gLives = 3



function onInit() {
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    gBoard = buildBoard()
    addMines(14)
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)

}

function buildBoard() {
    const size = 8
    const board = []

    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                cellContent: ''
            }
        }


    }

    return board
}



function setMinesNegsCount(board) {
    const ROWS = board.length;
    const COLS = board[0].length;
    for (var i = 0; i < ROWS; i++) {
        for (var j = 0; j < COLS; j++) {
            board[i][j].minesAroundCount = countNeighborsMines(board, i, j);
        }
    }
}


function countNeighborsMines(board, row, cols) {
    const ROWS = board.length
    const COLS = board[0].length
    var minesAroundCounter = 0

    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i === ROWS)
            continue

        for (var j = cols - 1; j <= cols + 1; j++) {
            if (j < 0 || j === COLS || (i === row && j === cols))
                continue

            if (board[i][j].isMine) {
                minesAroundCounter++
                console.log('minesAroundCounter : ', minesAroundCounter)

            }
        }
    }

    return minesAroundCounter
}


function renderBoard(board) {

    const elBoard = document.querySelector('.board-container')
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[i].length; j++) {
            const currCell = board[i][j]

            var cellClass = getClassName({ i, j })

            var cellContent = ''

            if (currCell.isMine && currCell.isShown) {
                cellContent = '💣'
            } else {
                if (currCell.isShown)

                    cellContent = currCell.minesAroundCount || ''


            }


            strHTML += `<td class="cell ${cellClass}"onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu=" onCellMarked(this,event,${i},${j})">${cellContent}</td>`

        }
        strHTML += '</tr>'
    }

    elBoard.innerHTML = strHTML


}

function onCellClicked(elCell, i, j) {
    if (!gGame.isOn) return
    if (gFirstClick) {
        gFirstClick = false
        gDate = Date.now()
        gGame.isOn = true
        gTimer = setInterval(() => {
            updateTime()
        }, 1000)
    }
    var currCell = gBoard[i][j]
    currCell.isShown = true
    gGame.shownCount++
    console.log('hi its me ', i, j)
    elCell.classList.add('clicked')
    if (currCell.isMine) {
        gLives--
        if (gLives === 0) {
            gameOverMine()
        }

    } else if (currCell.minesAroundCount === 0) {
        expandShown(gBoard, elCell, i, j)
    }

    renderCell(elCell, currCell)
    checkGameOver()

}



function renderCell(elCell, currCell) {
    if (currCell.isMarked) {
        elCell.textContent = '🚩'
    }
    if (currCell.isMine) {
        elCell.textContent = '💣'
    } else {
        elCell.textContent = currCell.minesAroundCount || '0'
    }

}



function onCellMarked(elCell, event, i, j) {
    if (!gGame.isOn) return
    gGame.markedCount++
    event.preventDefault()
    var currCell = gBoard[i][j]
    if (!currCell.isShown) {
        currCell.isMarked = !currCell.isMarked
        currCell.cellContent = currCell.isMarked ? FLAG : ''
    }

    elCell.innerHTML = currCell.cellContent
    checkGameOver()
}
function gameOverMine() {
    gGame.isOn = false
    console.log('game over')
    clearInterval(gTimer)
    const smileyButton = document.querySelector('button');
    smileyButton.textContent = '😢'


}

function checkGameOver() {
    var markedMinesCount = 0
    var revealedNonMinedCount = 0
    var totalMines = 0
    var totalNonMinedCells = 0

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var currCell = gBoard[i][j]

            if (currCell.isMine) {
                totalMines++
                if (currCell.isMarked) {
                    markedMinesCount++
                }
            } else {
                totalNonMinedCells++
                if (currCell.isShown) {
                    revealedNonMinedCount++
                }
            }
        }
    }


    if (markedMinesCount === totalMines && revealedNonMinedCount === totalNonMinedCells) {
        console.log('Congratulations, you won!')
        clearInterval(gTimer)
        const smileyButton = document.querySelector('button');
        smileyButton.textContent = '😎'
        gGame.isOn = false
    }

}




function addMines(minesAmount) {
    for (var i = 0; i < minesAmount; i++) {
        var randomI = getRandomIntInclusive(0, LEVEL[1] - 1)
        var randomJ = getRandomIntInclusive(0, LEVEL[1] - 1)
        gBoard[randomI][randomJ] = {
            minesAroundCount: 0,
            isShown: false,
            isMine: true,
            isMarked: false,
            cellContent: MINE
        }

    }
}



function getClassName(position) {
    const cellClass = `cell-${position.i}-${position.j}`
    return cellClass
}

function expandShown(board, elCell, row, col) {
    const ROWS = board.length;
    const COLS = board[0].length;
    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
            if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
                const neighborCell = board[r][c];
                if (!neighborCell.isShown && !neighborCell.isMarked) {
                    neighborCell.isShown = true;
                    renderCell(getCellElement(r, c), neighborCell);
                    if (neighborCell.minesAroundCount === 0) {
                        expandShown(board, getCellElement(r, c), r, c);
                    }
                }
            }
        }
    }
}

function handleMineClick() {
    updateLivesUI()
    if (gLives === 0) {
        gameOver()
    }
}
function updateLivesUI() {
    document.getElementById('lives').innerText = `Lives: ${gLives}`;
}
function handleSmileyButtonClick() {
    resetGame()
}
function resetGame() {
    clearInterval(gTimer)
    gFirstClick = true
    gGame.isOn = false
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gLives = 3
    updateLivesUI()
    resetBoard()
    renderBoard(gBoard)
}
function resetBoard() {
    onInit()
    updateTime()
    const smileyButton = document.querySelector('button');
    smileyButton.textContent = '😃'
}