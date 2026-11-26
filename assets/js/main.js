// --- VARIABLES GLOBALES ---
const gridTic = [["", "", ""], ["", "", ""], ["", "", ""]];
let gridPfour = Array.from({ length: 7 }, () => Array(6).fill(""));
const gameContainer = document.querySelector('#gameContainer');
const replayButton = document.querySelector('#replayButton');
const backToMenu = document.querySelector("#backToMenu");
const winner = document.querySelector("#winner");
const rulesMorpion = document.querySelector("#rulesMorpion");
const rulesPuissanceQ = document.querySelector("#rulesPuissanceQ");
const playButton = document.querySelector("#playButton");
const cat1 = new Audio("assets/audio/cat1.mp3");
const cat2 = new Audio("assets/audio/cat2.mp3");

// Joué dans le portfolio de Suzon : quand son son est coupé, les miaulements aussi
window.addEventListener("message", (e) => {
    if (e.source !== window.parent || !e.data || e.data.type !== "portfolio98:mute") return;
    cat1.muted = cat2.muted = e.data.muted;
});
const cookieCat = document.createElement("img");
cookieCat.src = "./assets/images/cookieCat.png";
cookieCat.textContent = "cookieCat";
const fishCat = document.createElement("img");
fishCat.src = "./assets/images/fishCat.png";
fishCat.textContent = "fishCat";
let img = "";
let tour = 0;
let audio = null;
let isPlayerTurn = true;
let isVsComputer = false;
let puissanceQ = false;

// Cache la grille et le bouton jouer au chargement
gameContainer.style.display = "none";
playButton.style.display = "none";

// --- INITIALISATION ---
function startGame() {
    document.querySelector("#gameMode").classList.add("hidden");
    document.querySelector("#chooseButton").addEventListener('click', () => {
        chooseGame();
        document.querySelector("#gameMode").classList.remove("hidden");
        document.querySelector("#chooseGame").classList.add("hidden");
        document.querySelector('#startButton').addEventListener('click', () => {
            changeGameMode();
            document.querySelector("#startScreen").classList.add("hidden");
            document.querySelector("#gameScreen").style.display = "flex";
            // Affiche la règle et le bouton jouer, cache la grille
            gameContainer.style.display = "none";
            replayButton.style.display = "none";
            backToMenu.style.display = "none";
            winner.textContent = "";
            playButton.style.display = "block";
            if (!puissanceQ) {
                rulesMorpion.style.display = "block";
                rulesPuissanceQ.style.display = "none";
            } else {
                rulesMorpion.style.display = "none";
                rulesPuissanceQ.style.display = "block";
            }
        });
    });
    replayButton.addEventListener('click', retry);
    backToMenu.addEventListener('click', menu);
}
startGame();

// Quand on clique sur "Jouer", on affiche la grille et on cache la règle + bouton
playButton.onclick = showGridAndStart;

function showGridAndStart() {
        document.getElementById('rulesContainer').style.display = 'none';
    rulesMorpion.style.display = "none";
    rulesPuissanceQ.style.display = "none";
    playButton.style.display = "none";
    gameContainer.style.display = "flex";
    replayButton.style.display = "none";
    backToMenu.style.display = "none";
    winner.textContent = "";
    tour = 0;
    isPlayerTurn = true;
    if (!puissanceQ) {
        createMapMorpion();
    } else {
        createMapPuissance4();
    }
    clickCell();
}

function chooseGame() {
    const puissanceQRadio = document.querySelector('#puissanceQ');
    puissanceQ = puissanceQRadio.checked;
}

function changeGameMode() {
    const vsComputerRadio = document.querySelector('#vsComputer');
    isVsComputer = vsComputerRadio.checked;
}

// --- GRILLE MORPION ---
function createMapMorpion() {
    gameContainer.innerHTML = "";
    let index = 0;
    gridTic.forEach((col) => {
        const colContainer = document.createElement('div');
        colContainer.classList.add('col');
        gameContainer.appendChild(colContainer);
        col.forEach(() => {
            const cellContainer = document.createElement('div');
            cellContainer.classList.add("cell", "sizeMorpion");
            cellContainer.classList.add('index' + index);
            colContainer.appendChild(cellContainer);
            index++;
        });
    });
}

// --- GRILLE PUISSANCE 4 ---
function createMapPuissance4() {
    gameContainer.innerHTML = "";
    for (let col = 0; col < 7; col++) {
        const colContainer = document.createElement('div');
        colContainer.classList.add('col');
        colContainer.dataset.col = col;
        colContainer.style.display = "inline-block";
        for (let row = 5; row >= 0; row--) {
            const cell = document.createElement('div');
            cell.classList.add('cell', 'sizePuissanceQ');
            cell.dataset.col = col;
            cell.dataset.row = row;
            colContainer.appendChild(cell);
        }
        gameContainer.appendChild(colContainer);
    }
}

// --- GESTION DES CLICS ---
function clickCell() {
    if (!puissanceQ) {
        document.querySelectorAll('.cell').forEach(cell => {
            cell.onclick = addImgOnceMorpion;
        });
    } else {
        document.querySelectorAll('.col').forEach(colDiv => {
            colDiv.onclick = function () {
                if (!isPlayerTurn || winner.textContent !== "") return;
                const col = parseInt(this.dataset.col);
                dropTokenPuissance4(col);
            };
        });
    }
}

// --- MORPION : AJOUT IMAGE ---
function addImgOnceMorpion() {
    if (this.classList.contains("stop") || winner.textContent !== "") return;
    changePlayer();
    this.appendChild(img.cloneNode(true));
    this.classList.add(img.textContent);
    this.classList.add("stop");
    audio.currentTime = 0;
    audio.play();
    tour++;
    winMorpion();
    if (winner.textContent == "") {
        isPlayerTurn = false;
        if (isVsComputer) {
            computerTurnMorpion();
        } else {
            isPlayerTurn = true;
        }
    }
}

// --- MORPION : CHANGEMENT DE JOUEUR ---
function changePlayer() {
    img = (tour % 2 == 0) ? cookieCat : fishCat;
    audio = (tour % 2 == 0) ? cat1 : cat2;
}

// --- MORPION : VICTOIRE ---
function winMorpion() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // lignes
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // colonnes
        [0, 4, 8], [2, 4, 6]             // diagonales
    ];
    winningCombinations.forEach(combination => {
        const [a, b, c] = combination;
        if (
            document.querySelector(".index" + a).classList.contains(img.textContent) &&
            document.querySelector(".index" + b).classList.contains(img.textContent) &&
            document.querySelector(".index" + c).classList.contains(img.textContent)
        ) {
            winner.textContent = (img.textContent == cookieCat.textContent) ? "Cookie-Cat gagne (=🝦ᆺ🝦=)" : "Fish-Cat gagne (=🝦ᆺ🝦=)";
            replayButton.style.display = "block";
            backToMenu.style.display = "block";
        }
    });
    if (tour === 9 && winner.textContent === "") {
        winner.textContent = "Match nul (=🝦ᆺ🝦=)";
        replayButton.style.display = "block";
        backToMenu.style.display = "block";
    }
}

// --- MORPION : IA ---
function computerTurnMorpion() {
    setTimeout(() => {
        let emptyCells = [];
        document.querySelectorAll('.cell').forEach(cell => {
            if (!cell.classList.contains("cookieCat") && !cell.classList.contains("fishCat")) {
                emptyCells.push(cell);
            }
        });
        if (emptyCells.length > 0) {
            let randomIndex = randomize(0, emptyCells.length - 1);
            let randomCell = emptyCells[randomIndex];
            changePlayer();
            randomCell.appendChild(img.cloneNode(true));
            randomCell.classList.add(img.textContent, "stop");
            audio.currentTime = 0;
            audio.play();
            tour++;
            winMorpion();
            isPlayerTurn = true;
        }
    }, 900);
}

// --- PUISSANCE 4 : CHUTE DU JETON ---
function dropTokenPuissance4(col) {
    let row = gridPfour[col].findIndex(cell => cell === "");
    if (row === -1) return; // colonne pleine

    // Détermine qui joue
    let currentPlayer, currentAudio;
    if (!isVsComputer) {
        currentPlayer = (tour % 2 == 0) ? cookieCat : fishCat;
        currentAudio = (tour % 2 == 0) ? cat1 : cat2;
    } else {
        currentPlayer = isPlayerTurn ? cookieCat : fishCat;
        currentAudio = isPlayerTurn ? cat1 : cat2;
    }

    const colDiv = document.querySelector(`.col[data-col="${col}"]`);
    const cells = Array.from(colDiv.querySelectorAll('.cell'));
    const targetCell = cells.find(cell => parseInt(cell.dataset.row) === row);

    // Taille réelle d'une case : elle s'adapte à l'écran (voir style.css)
    const size = targetCell.offsetHeight;
    const tempToken = currentPlayer.cloneNode(true);
    tempToken.style.position = "absolute";
    tempToken.style.left = "0";
    tempToken.style.top = `-${size}px`;
    tempToken.style.transition = "top 0.35s";
    tempToken.style.zIndex = 2;
    tempToken.style.width = `${size}px`;
    tempToken.style.height = `${size}px`;
    tempToken.style.objectFit = "contain";
    colDiv.appendChild(tempToken);

    setTimeout(() => {
        tempToken.style.top = `${(5 - row) * size}px`;
    }, 10);

    setTimeout(() => {
        colDiv.removeChild(tempToken);
        targetCell.appendChild(currentPlayer.cloneNode(true));
        targetCell.classList.add(currentPlayer.textContent, "stop");
        currentAudio.currentTime = 0;
        currentAudio.play();
        gridPfour[col][row] = currentPlayer.textContent;
        tour++;
        winPuissance4(col, row, currentPlayer.textContent);

        if (winner.textContent == "") {
            if (isVsComputer) {
                if (isPlayerTurn) {
                    isPlayerTurn = false;
                    setTimeout(computerTurnPuissance4, 500);
                } else {
                    isPlayerTurn = true;
                }
            } else {
                isPlayerTurn = true;
            }
        }
    }, 370);
}

// --- PUISSANCE 4 : IA ---
function computerTurnPuissance4() {
    let availableCols = [];
    for (let c = 0; c < 7; c++) {
        if (gridPfour[c].includes("")) availableCols.push(c);
    }
    if (availableCols.length === 0) return;
    let col = availableCols[randomize(0, availableCols.length - 1)];
    dropTokenPuissance4(col);
}

// --- PUISSANCE 4 : VICTOIRE ---
function winPuissance4(col, row, player) {
    function count(dx, dy) {
        let n = 0;
        let x = col + dx, y = row + dy;
        while (x >= 0 && x < 7 && y >= 0 && y < 6 && gridPfour[x][y] === player) {
            n++; x += dx; y += dy;
        }
        return n;
    }
    const directions = [
        [[1, 0], [-1, 0]], // horizontal
        [[0, 1], [0, -1]], // vertical
        [[1, 1], [-1, -1]], // diag /
        [[1, -1], [-1, 1]]  // diag \
    ];
    for (const dir of directions) {
        let total = 1 + count(...dir[0]) + count(...dir[1]);
        if (total >= 4) {
            winner.textContent = (player == cookieCat.textContent) ? "Cookie-Cat gagne (=🝦ᆺ🝦=)" : "Fish-Cat gagne (=🝦ᆺ🝦=)";
            replayButton.style.display = "block";
            backToMenu.style.display = "block";
            return;
        }
    }
    if (tour === 7 * 6 && winner.textContent === "") {
        winner.textContent = "Match nul (=🝦ᆺ🝦=)";
        replayButton.style.display = "block";
        backToMenu.style.display = "block";
    }
}

// --- OUTILS ---
function randomize(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- RELOAD / MENU ---
function reload() {
    tour = 0;
    winner.textContent = "";
    document.querySelectorAll('.cell').forEach(cell => {
        while (cell.firstChild) {
            cell.removeChild(cell.firstChild);
        }
        cell.classList.remove('cookieCat', 'fishCat', 'stop');
    });
    replayButton.style.display = "none";
    backToMenu.style.display = "none";
    isPlayerTurn = true;
    gridPfour = Array.from({ length: 7 }, () => Array(6).fill(""));
}

function retry() {
    reload();
    document.getElementById('rulesContainer').style.display = 'block';

    gameContainer.style.display = "none";
    playButton.style.display = "block";
    if (!puissanceQ) {
        rulesMorpion.style.display = "block";
        rulesPuissanceQ.style.display = "none";
    } else {
        rulesMorpion.style.display = "none";
        rulesPuissanceQ.style.display = "block";
    }
}

function menu() {
    document.querySelector("#gameScreen").style.display = "none";
    document.querySelector("#startScreen").classList.remove("hidden");
    document.querySelector("#gameMode").classList.add("hidden");
    document.querySelector("#chooseGame").classList.remove("hidden");
    document.getElementById('rulesContainer').style.display = 'block';

    rulesMorpion.style.display = "none";
    rulesPuissanceQ.style.display = "none";
    playButton.style.display = "none";
    reload();
}
