'use strict'


const MINE = '💣'
const FLAG = '🚩'
const LIFE = '❤'
const HINT = '💡'
var gBoard
var gLevel
var gGame
var gDate
var gTimer
var gFirstClick = true
var gLives = 3
var gSize = 4
var gMines = 2
var gHintsAllowed = 3
var gHint = false
var gMinesCounter = gMines





function onInit() {
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    gBoard = buildBoard()
    addMines(gMines)
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    gLives = 3
    gMinesCounter = gMines


}

function buildBoard() {
    // var gSize = 4
    const board = []

    for (var i = 0; i < gSize; i++) {
        board[i] = []
        for (var j = 0; j < gSize; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                cellContent: '',
                isHint: false
            }
        }


    }

    return board
}



function setMinesNegsCount(board) {
    const ROWS = board.length
    const COLS = board[0].length
    for (var i = 0; i < ROWS; i++) {
        for (var j = 0; j < COLS; j++) {
            board[i][j].minesAroundCount = countNeighborsMines(board, i, j)
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

            if (currCell.isMarked) {
                cellContent = FLAG
            }
            if (currCell.isMine && currCell.isShown) {
                cellContent = '💣'
            } else {
                if (currCell.isShown)

                    cellContent = currCell.minesAroundCount || '0'
            }



            strHTML += `<td class="cell ${cellClass} digit${cellContent}"onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu=" onCellMarked(this,event,${i},${j})">${cellContent}</td>`

        }
        strHTML += '</tr>'
    }

    elBoard.innerHTML = strHTML

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

function gameOverMine() {

    gGame.isOn = false
    console.log('game over')
    clearInterval(gTimer)
    const smileyButton = document.querySelector('.smiley button')
    smileyButton.textContent = '😢'
    showMinesOnLoss(gBoard)

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

            }

            if (currCell.isMarked) {
                markedMinesCount++


            } else {
                totalNonMinedCells++
                if (currCell.isShown) {

                    revealedNonMinedCount++
           
                }
            }
        }
    }

    if (markedMinesCount === totalMines || revealedNonMinedCount === totalNonMinedCells) {
        console.log('Congratulations, you won!')
        clearInterval(gTimer)
        const smileyButton = document.querySelector('.smiley button')
        smileyButton.textContent = '😎'
        gGame.isOn = false
    }

}

function addMines(minesAmount) {
    for (var i = 0; i < minesAmount; i++) {
        var randomI = getRandomIntInclusive(0, gSize - 1)
        var randomJ = getRandomIntInclusive(0, gSize - 1)
        gBoard[randomI][randomJ] = {
            minesAroundCount: 0,
            isShown: false,
            isMine: true,
            isMarked: false,
            cellContent: MINE
        }

    }
}

function expandShown(board, elCell, row, col) {
    const ROWS = board.length
    const COLS = board[0].length
    for (var r = row - 1; r <= row + 1; r++) {
        for (var c = col - 1; c <= col + 1; c++) {
            if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
                const neighborCell = board[r][c]
                if (!neighborCell.isShown && !neighborCell.isMarked) {
                    neighborCell.isShown = true
                    renderCell(getCellElement(r, c), neighborCell)
                    if (neighborCell.minesAroundCount === 0) {
                        expandShown(board, getCellElement(r, c), r, c)
                    }
                }
            }
        }
    }
}


function updateLivesUI() {
    const eLlives = document.querySelector('.lives')
    eLlives.textContent = `LIFE ${LIFE} x${gLives} `
}

function resetGame() {
    clearInterval(gTimer)
    gFirstClick = true
    gGame.isOn = false
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0

    gLives = 3
    gHintsAllowed = 3
    updateLivesUI()
    resetBoard()
    setTimeZero()
    updateMinesUI()
    renderBoard(gBoard)


}
function resetBoard() {
    onInit()
    updateTime()
    const smileyButton = document.querySelector('.smiley button')
    smileyButton.textContent = '😃'
}






function applyHintEffect(elCell, i, j) {
    const ROWS = gBoard.length
    const COLS = gBoard[0].length
    for (var r = i - 1; r <= i + 1; r++) {
        for (var c = j - 1; c <= j + 1; c++) {
            if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
                const neighborCell = gBoard[r][c]
                const neighborCellElement = document.querySelector(`.cell-${r}-${c}`)
                elCell.classList.add('clicked')
                elCell.classList.add('digitx')
                neighborCellElement.classList.add('digitx')
                renderCell(neighborCellElement, neighborCell)

            }
        }
    }

    setTimeout(function () {
        removeHint(elCell, i, j)
    }, 1000)
}



function removeHint(elCell, i, j) {
    const ROWS = gBoard.length
    const COLS = gBoard[0].length

    for (var r = i - 1; r <= i + 1; r++) {
        for (var c = j - 1; c <= j + 1; c++) {
            if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
                const neighborCell = gBoard[r][c]
                const neighborCellElement = document.querySelector(`.cell-${r}-${c}`)
                neighborCellElement.classList.remove('clicked')
                neighborCellElement.classList.add('content')
                renderCell(neighborCellElement, neighborCell)

            }
        }
    }
    renderBoard(gBoard)
}

function minesPlacing() {
    gMinesCounter = gMines
    const elMines = document.querySelector('.mines-placing')
    elMines.textContent = `MINES left to placed: x${MINE} ${gManuallyMinesCounter}`

}


function showMinesOnLoss(board) {

    for (var i = 0; i < gSize; i++) {
        for (var j = 0; j < gSize; j++) {
            {
                if (board[i][j].cellContent === MINE) {
                    board[i][j].isShown = true
                }
            }
        }
    }
    renderBoard(gBoard)
}



