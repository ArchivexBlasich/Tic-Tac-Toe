function gameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    function initBoard() {
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(cell());
            }
        }
    };

    function setBoardCell(row, column, mark) {
        if (!board[row][column].isEmpty()) {
            return "CellNotEmpty";
        }
        board[row][column].setCellMark(mark);
    };

    function getBoardCell(row, column) {
        return board[row][column].getCellMark();
    };

    function getBoardSize() {
        return rows;
    };

    function printBoard() {
        for (let i = 0; i < rows; i++) {
            console.log(`${board[i][0].getCellMark()} `,
                `${board[i][1].getCellMark()} `,
                `${board[i][2].getCellMark()}`
            );
        }
    };

    function resetBoard() {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                board[i][j].reset();
            }
        }
    }


    initBoard();

    return {
        setBoardCell,
        getBoardCell,
        getBoardSize,
        printBoard,
        resetBoard,
    }
};

function gameController() {
    const board = gameBoard();
    const player1 = {
        name: "player1",
        mark: "X",
    };
    const player2 = {
        name: "player2",
        mark: "O",
    };
    let playerTurn = (Math.round(Math.random()) === 0) ? player1 : player2;
    let winner = "";

    function toggleTurn() {
        playerTurn = (playerTurn === player2) ? player1 : player2;
    };

    function selectCell(row, column) {
        if (winner !== "") {
            return;
        }

        let boardSize = board.getBoardSize()
        if (Math.abs(row) > boardSize || Math.abs(column) > boardSize) {
            console.log(`Error- select a row and a column between 0 an ${boardSize}`);
            return;
        };

        if (board.setBoardCell(row, column, playerTurn.mark) === "CellNotEmpty") {
            return;
        }

        if (thereIsWinner()) {
            console.log(`${playerTurn.name} with ${playerTurn.mark} Win the game`);
            winner = playerTurn;
        } else {
            toggleTurn();
        }
    };

    function thereIsWinner() {
        let boardSize = board.getBoardSize();

        for (let i = 0; i < boardSize; i++) {
            // search a if there is a row match
            if (board.getBoardCell(i, 0) !== ""
                && board.getBoardCell(i, 1) !== ""
                && board.getBoardCell(i, 2) !== "") {

                if ((board.getBoardCell(i, 0) === board.getBoardCell(i, 1)) &&
                    (board.getBoardCell(i, 1) === board.getBoardCell(i, 2))) {
                    return true;
                }
            }

            // search a if there is a column match
            if (board.getBoardCell(0, i) !== ""
                && board.getBoardCell(1, i) !== ""
                && board.getBoardCell(2, i) !== "") {

                if ((board.getBoardCell(0, i) === board.getBoardCell(1, i)) &&
                    (board.getBoardCell(1, i) === board.getBoardCell(2, i))) {
                    return true;
                }
            }
        }

        // search a if there is a diagonal match
        if (board.getBoardCell(0, 0) !== ""
            && board.getBoardCell(1, 1) !== ""
            && board.getBoardCell(2, 2)) {

            if ((board.getBoardCell(0, 0) === board.getBoardCell(1, 1)) &&
                (board.getBoardCell(1, 1) === board.getBoardCell(2, 2))) {
                return true;
            }
        }

        if (board.getBoardCell(0, 2) !== ""
            && board.getBoardCell(1, 1) !== ""
            && board.getBoardCell(2, 0)) {

            if ((board.getBoardCell(0, 2) === board.getBoardCell(1, 1)) &&
                (board.getBoardCell(1, 1) === board.getBoardCell(2, 0))) {
                return true;
            }
        }

        return false;
    };

    function newGame() {
        winner = "";
        playerTurn = (Math.round(Math.random()) === 0) ? player1 : player2;
        board.resetBoard();
    };

    return {
        selectCell,
        newGame,
        board,
    };
}

function cell() {
    let cellMark = "";

    function setCellMark(mark) {
        cellMark = mark;
    };

    function getCellMark() {
        return cellMark;
    };

    function isEmpty() {
        return cellMark === "";
    }

    function reset() {
        cellMark = "";
    }

    return {
        setCellMark,
        getCellMark,
        isEmpty,
        reset,
    };
}

let game = gameController();