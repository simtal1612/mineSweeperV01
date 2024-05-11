function onClickEasy() {
    gSize = 4
    gMines = 2
    gLives = 2
    // gManuallyMinesCounter = 2
    gMinesCounter = gMines
    resetGame()


}
function onClickMedium() {
    gSize = 8
    gMines = 14
    // gManuallyMinesCounter = 14
    gMinesCounter = gMines
    resetGame()
}
function onClickHard() {
    gSize = 12
    gMines = 32
    // gManuallyMinesCounter = 32
    gMinesCounter = gMines
    resetGame()
}
function handleSmileyButtonClick() {
    resetGame()
}
function handleMineClick() {
    // if(gManuallyMinesMode)return
    gLives--
    gMinesCounter--
    updateMinesUI()
    updateLivesUI()
    if (gLives === 0) {
        gameOverMine()
    }
}

function onCellMarked(elCell, e, i, j) {
    e.preventDefault()

    if (!gGame.isOn) return

    var currCell = gBoard[i][j]

    if (currCell.isShown) return

    currCell.isMarked = !currCell.isMarked
    currCell.textContent = FLAG

    elCell.innerHTML = elCell.innerHTML ? null : FLAG
    renderBoard(gBoard)
    checkGameOver()
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
    if (elCell.classList.contains('hint-active')) {
        applyHintEffect(elCell, i, j)
        return
    }
    currCell.isShown = true
    gGame.shownCount++

    if (currCell.isMine) {
        handleMineClick()
        if (gLives === 0 || gMinesCounter === 0) {
            gameOverMine()
        }

    } else if (currCell.minesAroundCount === 0) {
        expandShown(gBoard, elCell, i, j)
    }
    renderCell(elCell, currCell)
    renderBoard(gBoard)
    checkGameOver()
}


function onHintClick(timeout = 3000) {
    if (gHintsAllowed === 0) return
    gHintsAllowed--
    gHint = true
   

    const cells = document.querySelectorAll('.cell')
    for (var i = 0; i < cells.length; i++) {
        cells[i].classList.add('hint-active')
    }

    setTimeout(() => {
        gHint = false
      

        for (var i = 0; i < cells.length; i++) {
            cells[i].classList.remove('hint-active')
            cells[i].classList.remove('clicked')
        }
    }, timeout)
}