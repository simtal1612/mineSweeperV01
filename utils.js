function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled)
}
function updateTime() {
    if (!gGame.isOn || gFirstClick) return

    var date = Date.now();
    var ms = date - gDate

    var sec = parseInt(ms / 1000)

    const elTimer = document.querySelector('.timer')

    elTimer.innerHTML = sec
}
function getCellElement(row, col) {
    return document.querySelector(`.cell-${row}-${col}`);
}