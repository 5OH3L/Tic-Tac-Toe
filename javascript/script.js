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
                DOMController.updateDOM(true, activePlayerMarker);
            } else {
                switchPlayer();
                DOMController.updateDOM();
            }
            console.log(activePlayerMarker === 1 ? "Player One's Turn" : "Player Two's Turn")
            console.table(board);
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
    function getActivePlayer(){
        return activePlayerMarker;
    }
    return { placeMarker, checkWin, getActivePlayer }
})();

const DOMController = (function () {
    const boardElement = document.getElementById('tic-tac-toe');
    const board = Gameboard.getBoard();

    function CreateGameDOM() {
        board.forEach((row, rowIndex) => {
            const rowElement = document.createElement('div');
            rowElement.classList.add("row");
            rowElement.classList.add(`row${rowIndex + 1}`)

            row.forEach((column, columnIndex) => {
                const columnElement = document.createElement('button');
                columnElement.classList.add("column");
                columnElement.classList.add(`column${columnIndex+1}`);
                columnElement.dataset.row = rowIndex;
                columnElement.dataset.column = columnIndex;
                columnElement.addEventListener('click', () =>{
                    GameController.placeMarker(rowIndex, columnIndex);
                });
                rowElement.appendChild(columnElement);
            });
            boardElement.appendChild(rowElement);
        });
        
        updateDOM();
    }

    function updateDOM(gameOver = false, activePlayerMarker = 0){
        const board = Gameboard.getBoard()
        const cells = Array.from(boardElement.getElementsByClassName('column'));
        let activePlayer = GameController.getActivePlayer();
        const ticTacToe = document.getElementById('tic-tac-toe');
        ticTacToe.style.setProperty('--cell-size', `${cells[0].clientWidth}px`);
        ticTacToe.classList.remove('x');
        ticTacToe.classList.remove('o');
        activePlayer == 1 ? ticTacToe.classList.add('x') : ticTacToe.classList.add('o');

        if (window.innerHeight < window.innerWidth) {
            ticTacToe.style.setProperty('--size', "70vh");
        } else {
            ticTacToe.style.setProperty('--size', "70vw");
        }

        cells.forEach(cell =>{
            const row = cell.dataset.row;
            const column = cell.dataset.column;

            if(board[row][column] == 1){
                cell.classList.add('x');
            }else if(board[row][column] == 2){
                cell.classList.add('o');
            }
        });
        gameOver == true ? setTimeout(() => {RestartGame(activePlayerMarker)}, 1) : null;
    }
    function RestartGame(activePlayer){
        // Alert Who Won For Now
        alert(`${activePlayer == 1 ? "Player 1 Won!" : "Player 2 Won!"}`)
    }
    CreateGameDOM();
    return { CreateGameDOM, updateDOM}
})();

// Responsive Grid
window.onresize = function () {
    const ticTacToe = document.getElementById('tic-tac-toe');
    const cells = Array.from(document.getElementsByClassName('column'));
    if (window.innerHeight < window.innerWidth) {
        ticTacToe.style.setProperty('--size', "70vh");
    } else {
        ticTacToe.style.setProperty('--size', "70vw");
    }
    ticTacToe.style.setProperty('--cell-size', `${cells[0].clientWidth}px`)
};