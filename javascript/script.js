const Gameboard = function () {
    const board = [[0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]];
    function getBoard() { return board };
    return { getBoard };
}();
const GameController = function () {
    let activePlayerMarker = 1;
    const board = Gameboard.getBoard();
    function placeMarker(row, column) {
        if (board[row][column] == 0) {
            board[row][column] = activePlayerMarker;
            switchPlayer();
        }
    }
    function switchPlayer() {
        activePlayerMarker = activePlayerMarker == 1 ? 2 : 1;
    }
    return { placeMarker }
}();

const Player = function (name, marker) {
    this.name = name;
    this.marker = marker;
    const getName = () => this.name;
    const getMarker = () => this.marker;
    return { getName, getMarker };
};
const playerOne = new Player("Player-One", 1);
const playerTwo = new Player("Player-Two", 2);

console.table(Gameboard.getBoard());