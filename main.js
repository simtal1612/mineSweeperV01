'use strict'

const LEVEL = [4, 8, 12]
const MINES = [2, 14, 32]
const MINE = '💣'
var gBoard
var gLevel
var gGame



function onInit() {       
    gBoard = buildBoard()
     setMinesNegsCount(gBoard)
    renderBoard(gBoard)
   
  
   
    

}

function buildBoard() {
    const size = 4
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
    board[1][1] = {
        minesAroundCount: 0,
        isShown: true,
        isMine: true,
        isMarked: false,
        cellContent: MINE
    }
    board[2][2] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: true,
        isMarked: false,
        cellContent: MINE
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
                console.log('minesAroundCounter : ' , minesAroundCounter)

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
            }else {
                cellContent = currCell.minesAroundCount || ''
              
            }


            strHTML += `<td class="cell ${cellClass}">${cellContent}</td>`

        }
        strHTML += '</tr>'
    }

    elBoard.innerHTML = strHTML


}

function onCellClicked(elCell, i, j) {

}

function onCellMarked(elCell) {

}

function checkGameOver() {

}
function expandShown(board, elCell, i, j) {

}

function addMines() {

}



function getClassName(position) {
    const cellClass = `cell-${position.i}-${position.j}`
    return cellClass
}

