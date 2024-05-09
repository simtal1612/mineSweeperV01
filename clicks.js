function onClickEasy() {
    gSize = 4
    gMines = 2
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
    gLives--
    gMinesCounter--
    updateMinesUI()
    updateLivesUI()
    if (gLives === 0) {
        gameOverMine()
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
function onCellClicked(elCell, i, j) {

    if (!gGame.isOn) return
    // if (gHint)
        // if(gManuallyMinesMode && gManuallyMinesCounter>0 ){
        //     for(var m = 0; m < gSize ; m++){ 
        //         console.log('place mine')
        //         addMinesManually(elCell,i,j)
            // }
                
        // }
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
        applyHintEffect(elCell,i,j)
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
    checkGameOver()
}


function onHintClick(timeout = 3000) {
    if(gHintsAllowed === 0 )return
    gHintsAllowed --
    gHint = true
    console.log('Hint activated!')

    const cells = document.querySelectorAll('.cell')
    for (var i = 0; i < cells.length; i++) {
        cells[i].classList.add('hint-active')
    }

    setTimeout(() => {
        gHint = false
        console.log('Hint deactivated!')

        for (var i = 0; i < cells.length; i++) {
            cells[i].classList.remove('hint-active')
            cells[i].classList.remove('clicked')
        }
    }, timeout)
}