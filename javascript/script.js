const Gameboard = (function () {
    let row = 3;
    let column = 3;
    const board = [];

    function initBoard() {
        board.length = 0;
        for (let i = 0; i < row; i++) {
            board[i] = [];
            for (let j = 0; j < column; j++) {
                board[i].push(0);
            }
        }
    };
    initBoard();

    return {
        getBoard: () => board,
        resetBoard: () => initBoard(),
        setSize: (newRow, newColumn) => {
            row = newRow;
            column = newColumn;
            initBoard();
        },
    };
})();

const GameController = (function () {
    const board = Gameboard.getBoard()
    let activePlayerMarker = 1;

    const switchPlayer = () => activePlayerMarker = activePlayerMarker === 1 ? 2 : 1;

    function placeMarker(row, column) {
        if (board[row][column] === 0) {
            board[row][column] = activePlayerMarker;
            if (checkWin()) {
                DOMController.updateDOM(true);
            } else if (checkDraw()) {
                DOMController.updateDOM(true);
            } else {
                switchPlayer();
                DOMController.updateDOM();
                console.table(board);
                console.log(activePlayerMarker === 1 ? "Player One's Turn ( X )" : "Player Two's Turn ( O )")
            }
        } else {
            console.log(`The cell is already filled (${row},${column})`)
        }
    };

    function checkWin() {
        const size = board.length;

        // Row Check
        for (let i = 0; i < size; i++) {
            if (board[i].every(cell => cell === activePlayerMarker)) {
                return true;
            }
        }

        // Column Check
        for (let i = 0; i < size; i++) {
            if (board.every(row => row[i] === activePlayerMarker)) {
                return true;
            }
        }

        // Diagonal Check Top-left To Bottom-right
        if (board.every((row, index) => row[index] === activePlayerMarker)) {
            return true;
        }

        // Diagonal Check Bottom-right to Top-left
        if (board.every((row, index) => row[size - 1 - index] === activePlayerMarker)) {
            return true;
        }
        return false;
    };

    function checkDraw() {
        const board = Gameboard.getBoard();
        if (board.every(row => row.every(column => column !== 0))) {
            activePlayerMarker = 0;
            console.log("It is a Draw!");
            return true;
        } else {
            return false;
        }
    }

    function restartGame(activePlayer) {
        activePlayerMarker = 1;
        const popUpBackground = document.getElementById('pop-up-background');
        const popUp = document.getElementById('pop-up');
        // Show Pop Up Background
        popUpBackground.classList.remove('show');
        popUpBackground.classList.remove('close');
        popUpBackground.classList.add('show');

        // Show Pop Up
        popUp.classList.remove('show');
        popUp.classList.remove('close');
        popUp.classList.add('show');

        // Add Event Listener To Restart Button
        const restart = document.getElementById('restart');
        restart.removeEventListener('click', _restart);
        restart.addEventListener('click', _restart);
        function _restart() {
            document.getElementById('tic-tac-toe').innerHTML = "";
            DOMController.CreateGameDOM()
            // Hide Pop Up Background
            popUpBackground.classList.remove('show');
            popUpBackground.classList.remove('close');
            popUpBackground.classList.add('close');

            // Hide Pop Up
            popUp.classList.remove('show');
            popUp.classList.remove('close');
            popUp.classList.add('close');
        }
    }
    function getActivePlayer() {
        return activePlayerMarker;
    }
    return { placeMarker, checkWin, getActivePlayer, restartGame, }
})();

const DOMController = (function () {
    const boardElement = document.getElementById('tic-tac-toe');
    const board = Gameboard.getBoard();

    function CreateGameDOM() {
        console.table(board);
        console.log(`${GameController.getActivePlayer() == 1 ? "Player One's Turn ( X )" : "Player Two's Turn ( O )"}`);
        Gameboard.resetBoard();
        const reset = document.getElementById('reset');
        reset.removeEventListener('click', resetGame);
        reset.addEventListener('click', resetGame);
        board.forEach((row, rowIndex) => {
            const rowElement = document.createElement('div');
            rowElement.classList.add("row");
            rowElement.classList.add(`row${rowIndex + 1}`)

            row.forEach((column, columnIndex) => {
                const columnElement = document.createElement('button');
                columnElement.classList.add("column");
                columnElement.classList.add(`column${columnIndex + 1}`);
                columnElement.dataset.row = rowIndex;
                columnElement.dataset.column = columnIndex;
                columnElement.addEventListener('click', () => {
                    GameController.placeMarker(rowIndex, columnIndex);
                });
                rowElement.appendChild(columnElement);
            });
            boardElement.appendChild(rowElement);
        });

        updateDOM();
    }

    function updateDOM(gameOver = false) {
        const board = Gameboard.getBoard()
        const cells = Array.from(boardElement.getElementsByClassName('column'));
        let activePlayer = GameController.getActivePlayer();
        const ticTacToe = document.getElementById('tic-tac-toe');
        setSize();
        ticTacToe.classList.remove('x');
        ticTacToe.classList.remove('o');
        activePlayer == 1 ? ticTacToe.classList.add('x') : ticTacToe.classList.add('o');

        cells.forEach(cell => {
            const row = cell.dataset.row;
            const column = cell.dataset.column;

            if (board[row][column] == 1) {
                cell.classList.add('x');
            } else if (board[row][column] == 2) {
                cell.classList.add('o');
            }
        });
        if (gameOver) {
            GameController.restartGame(activePlayer)
            // Edit Winning Message
            const winningMessage = document.getElementById('winningMessage');
            winningMessage.textContent = ""
            winningMessage.textContent = `${activePlayer == 0 ? "It is a Draw!" : activePlayer == 1 ? "PLAYER 1 WON!" : "PLAYER 2 WON!"}`
            console.log(winningMessage.textContent);
            console.log('<-| GAME ENDED |->')
        }
    }
    function resetGame() {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                board[i][j] = 0;
            }
        }
        console.log("<-| GAME RESET |->")
        document.getElementById('tic-tac-toe').innerHTML = "";
        DOMController.CreateGameDOM();

    }
    CreateGameDOM();
    return { CreateGameDOM, updateDOM, resetGame }
})();

// Responsive Grid
function setSize() {
    const ticTacToe = document.getElementById('tic-tac-toe');
    const cells = Array.from(document.getElementsByClassName('column'));
    const popUp = document.getElementById('pop-up');
    const programmerContainer = document.getElementById('programmer-container');

    if (window.innerHeight < window.innerWidth) {
        ticTacToe.style.setProperty('--size', "70vh");
        popUp.style.setProperty('--size', "50vh");
        programmerContainer.style.setProperty('--programmer-font-size', "2.5vh");
    } else {
        ticTacToe.style.setProperty('--size', "70vw");
        popUp.style.setProperty('--size', "50vw");
        programmerContainer.style.setProperty('--programmer-font-size', "2.5vw");
    }
    ticTacToe.style.setProperty('--cell-size', `${cells[0].clientWidth}px`)
};
setSize();
window.addEventListener('load', setSize);
window.addEventListener('resize', setSize);