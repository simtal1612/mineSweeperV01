function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled)
}
function updateTime() {
    if (!gGame.isOn || gFirstClick) return

    var date = Date.now()
    var ms = date - gDate

    var sec = parseInt(ms / 1000)

    const elTimer = document.querySelector('.timer')

    elTimer.innerHTML = `Seconds : ${sec}`
}
function getCellElement(row, col) {
    return document.querySelector(`.cell-${row}-${col}`)
}

function setTimeZero() {
    const elTimer = document.querySelector('.timer')
    elTimer.innerHTML = `Seconds : 0`
}

function darkMode(){
    const darkModeToggle = document.querySelector('.dark-mode')
    document.body.classList.toggle('dark-mode')
}
function updateMinesUI(){
    if(gMines < 0) return
    const elMines = document.querySelector('.mines')
    elMines.textContent = `MINES LEFT: x${MINE} ${gMinesCounter}`

}
function getClassName(position) {
    const cellClass = `cell-${position.i}-${position.j}`
    return cellClass
}

