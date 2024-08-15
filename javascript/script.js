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
                alert(activePlayerMarker === 1 ? "Player One Won" : "Player Two Won");
                Gameboard.resetBoard();
            } else {
                switchPlayer();
            }
            console.table(board);
            console.log(activePlayerMarker === 1 ? "Player One's Turn" : "Player Two's Turn")
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

    console.table(board);
    console.log(activePlayerMarker === 1 ? "Player One's Turn" : "Player Two's Turn");

    return { placeMarker, checkWin }
})();