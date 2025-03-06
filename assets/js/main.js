const gridTic = [["", "", ""], ["", "", ""], ["", "", ""]]
const gameContainer = document.querySelector('#gameContainer')
const replayButton = document.querySelector('#replayButton')
const winner = document.querySelector("#winner")
const cat1 = new Audio("assets/audio/cat1.mp3")
const cat2 = new Audio("assets/audio/cat2.mp3")
const cookieCat = document.createElement("img")
cookieCat.src = "./assets/images/cookieCat.jpg"
cookieCat.textContent = "cookieCat"
const fishCat = document.createElement("img")
fishCat.src = "./assets/images/fishCat.jpg"
fishCat.textContent = "fishCat"
let img = ""
let tour = 0
let audio = null
let isPlayerTurn = true
let isVsComputer = false

function randomize(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function startGame() {
    document.querySelector('#startButton').addEventListener('click', () => {
        changeGameMode()
        document.querySelector("#startScreen").style.display = "none"
        document.querySelector("#gameScreen").style.display = "block"
        createMap(gridTic)
        clickCell()
    })
    replayButton.addEventListener('click', retry)
}

function changeGameMode() {
    const vsComputerRadio = document.querySelector('#vsComputer')
    isVsComputer = vsComputerRadio.checked
}

function createMap(map) {
    let index = 0
    map.forEach((col) => {
        const colContainer = document.createElement('div')
        colContainer.classList.add('col')
        gameContainer.appendChild(colContainer)
        col.forEach(() => {
            const cellContainer = document.createElement('div')
            cellContainer.classList.add("cell")
            cellContainer.classList.add('index' + index)
            colContainer.appendChild(cellContainer)
            index++
        })
    })
}

function clickCell() {
    document.querySelectorAll('.cell').forEach(cell => {
        if (isPlayerTurn) {
            cell.addEventListener('click', addImgOnce)
        } else {
            cell.removeEventListener('click', addImgOnce)
        }
    })
}

function retry() {
    tour = 0;
    winner.textContent = ""
    document.querySelectorAll('.cell').forEach(cell => {
        while (cell.firstChild) {
            cell.removeChild(cell.firstChild)
        }
        cell.classList.remove('cookieCat', 'fishCat', 'stop')
    })
    replayButton.style.display = "none"
    isPlayerTurn = true
    clickCell()
}

function addImgOnce() {
    changePlayer()
    if (isPlayerTurn && !this.classList.contains("stop") && winner.textContent == "") {
        this.appendChild(img.cloneNode(true))
        this.classList.add(img.textContent)
        this.classList.add("stop")
        audio.currentTime = 0
        audio.play()
        tour++
        win()
        if (winner.textContent == "") {
            isPlayerTurn = false
            if (isVsComputer) {
                computerTurn()
            } else {
                isPlayerTurn = true
                clickCell()
            }
        }
    }
}

function changePlayer() {
    if (tour % 2 == 0) {
        img = cookieCat
        audio = cat1
        isPlayerTurn = true
    } else {
        img = fishCat
        audio = cat2
        if (isVsComputer) {
            isPlayerTurn = false
        }
    }
}

function win() {
    const winningCombinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
    winningCombinations.forEach(combination => {
        const [a, b, c] = combination
        if (
            document.querySelector(".index" + a).classList.contains(img.textContent) &&
            document.querySelector(".index" + b).classList.contains(img.textContent) &&
            document.querySelector(".index" + c).classList.contains(img.textContent)
        ) {
            winner.textContent = (img.textContent == cookieCat.textContent) ? "Cookie-Cat gagne (=🝦ᆺ🝦=)" : "Fish-Cat gagne (=🝦ᆺ🝦=)"
            replayButton.style.display = "block"
        }
    })
    if (tour === 9 && winner.textContent === "") {
        winner.textContent = "Match nul (=🝦ᆺ🝦=)"
        replayButton.style.display = "block"
    }
}

function computerTurn() {
    setTimeout(() => {
        let emptyCells = []
        document.querySelectorAll('.cell').forEach(cell => {
            if (!cell.classList.contains("cookieCat") && !cell.classList.contains("fishCat")) {
                emptyCells.push(cell)
            }
        });
        if (emptyCells.length > 0) {
            let randomIndex = randomize(0, emptyCells.length - 1)
            let randomCell = emptyCells[randomIndex]
            changePlayer()
            randomCell.appendChild(img.cloneNode(true))
            randomCell.classList.add(img.textContent, "stop")
            audio.currentTime = 0
            audio.play()
            tour++
            win()
            isPlayerTurn = true
            clickCell()
        }
    }, 1000)
}

startGame()