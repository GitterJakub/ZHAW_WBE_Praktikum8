const express = require('express');
const app = express();
const port = 3000;

let gameState = Array(6).fill(' ').map(() => Array(7).fill(' '));
let currentPlayer = 'red';
let history = [];
let finished = false;

app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.get('/gameState', (req, res) => {
    res.json({ gameState, currentPlayer, history, finished });
});

app.post('/gameState', (req, res) => {
    const { newGameState, newCurrentPlayer, newHistory, newFinished } = req.body;
    gameState = newGameState;
    currentPlayer = newCurrentPlayer;
    history = newHistory;
    finished = newFinished;
    res.sendStatus(200);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});