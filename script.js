let events = {
    events: {},
    on: function (eventName, fn) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(fn);
    },
    off: function (eventName, fn) {
        if (this.events[eventName]) {
            for (var i = 0; i < this.events[eventName].length; i++) {
                if (this.events[eventName][i] === fn) {
                    this.events[eventName].splice(i, 1);
                    break;
                }
            };
        }
    },
    emit: function (eventName, data) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(function (fn) {
                fn(data);
            });
        }
    }
};

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

    // This function is just for test functionality reasons
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
        resetBoard,
    }
};

function gameController() {
    const board = gameBoard();
    const player1 = {
        name: "player1",
        mark: "O",
    };
    const player2 = {
        name: "player2",
        mark: "X",
    };
    let playerTurn = (Math.round(Math.random()) === 0) ? player1 : player2;
    let winner = "";

    function toggleTurn() {
        playerTurn = (playerTurn === player2) ? player1 : player2;
    };

    // bind events
    events.on("cellPress", selectCell)

    function selectCell({ row, column }) {
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

        events.emit("setBoardCell", { row: row, column: column, player: playerTurn });

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

function ScreenController() {
    const buttons = document.querySelectorAll(".board > button");
    const dialog = document.querySelector("dialog");

    // bind Event
    events.on("setBoardCell", render)

    // Functions
    function init() {
        let index = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                buttons[index].setAttribute('data-row', `${i}`);
                buttons[index].setAttribute('data-column', `${j}`);
                buttons[index].addEventListener("click", cellPress);
                index++;
            }
        }
    };

    function render({ row, column, player }) {
        buttons.forEach((btn) => {
            if (btn.dataset.row === row && btn.dataset.column === column) {
                btn.textContent = player.mark;
                btn.classList.add(`${player.name}`);
            }
        });
    }

    function cellPress(e) {
        events.emit('cellPress', { row: e.target.dataset.row, column: e.target.dataset.column, })
    }

    init();

    return;
}

let game = ScreenController();