let state = [];
let currentPlayer = 'red';
let history = [];
let finished = false;

async function fetchGameState() {
    const response = await fetch('/gameState');
    const data = await response.json();
    state = data.gameState;
    currentPlayer = data.currentPlayer;
    history = data.history;
    finished = data.finished;
}

async function saveGameState() {
    await fetch('/gameState', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            newGameState: state,
            newCurrentPlayer: currentPlayer,
            newHistory: history,
            newFinished: finished,
        }),
    });
}

function showBoard() {
    const board = document.getElementById("board");
    board.innerHTML = '';
    const resetButton = document.getElementById("reset");
    resetButton.removeEventListener("click", resetGame);
    resetButton.addEventListener("click", resetGame);

    const undoButton = document.getElementById("undo");
    undoButton.removeEventListener("click", undoLastMove);
    undoButton.addEventListener("click", undoLastMove);

    const currentPlayerP = document.getElementById("turn");
    currentPlayerP.innerHTML = `Current player: ${currentPlayer}`;

    for (let row = 0; row < state.length; row++) {
        for (let col = 0; col < state[row].length; col++) {
            const field = elt("div", { className: "field" });
            field.addEventListener("click", () => {
                if (!finished) {
                    console.log(`Row: ${row}, Col: ${col}`);
                    clickHandler(row, col);
                }
            });

            if (state[row][col] === 'red') {
                field.appendChild(elt("div", { className: "piece red" }));
            } else if (state[row][col] === 'blue') {
                field.appendChild(elt("div", { className: "piece blue" }));
            }

            board.appendChild(field);
        }
    }

    if (connect4Winner('red', state)) {
        alert('Red wins!');
        finished = true;
    } else if (connect4Winner('blue', state)) {
        alert('Blue wins!');
        finished = true;
    }
}

function elt(type, props, ...children) {
    let dom = document.createElement(type);
    if (props) Object.assign(dom, props);
    for (let child of children) {
        if (typeof child != 'string') dom.appendChild(child);
        else dom.appendChild(document.createTextNode(child));
    }
    return dom;
}

function clickHandler(row, col) {
    for (let i = state.length - 1; i >= 0; i--) {
        if (state[i][col] === ' ') {
            history.push({ row: i, col, player: currentPlayer });
            state[i][col] = currentPlayer;
            currentPlayer = currentPlayer === 'red' ? 'blue' : 'red';
            saveGameState();
            break;
        }
    }
    showBoard();
}

function connect4Winner(player, board) {
    const ROWS = board.length;
    const COLS = board[0].length;

    function checkDirection(row, col, dRow, dCol) {
        let count = 0;
        for (let i = 0; i < 4; i++) {
            const r = row + i * dRow;
            const c = col + i * dCol;
            if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
                count++;
            } else {
                break;
            }
        }
        return count === 4;
    }

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (
                checkDirection(row, col, 0, 1) || // Horizontal
                checkDirection(row, col, 1, 0) || // Vertical
                checkDirection(row, col, 1, 1) || // Diagonal (down-right)
                checkDirection(row, col, 1, -1)   // Diagonal (down-left)
            ) {
                return true;
            }
        }
    }
    return false;
}

function undoLastMove() {
    if (history.length > 0) {
        const lastMove = history.pop();
        state[lastMove.row][lastMove.col] = ' ';
        currentPlayer = lastMove.player;
        finished = false;
        saveGameState();
        showBoard();
    }
}

function resetGame() {
    state = Array(6).fill(' ').map(() => Array(7).fill(' '));
    currentPlayer = 'red';
    history = [];
    finished = false;
    saveGameState();
    showBoard();
}

fetchGameState().then(showBoard);