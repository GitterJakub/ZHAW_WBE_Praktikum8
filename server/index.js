const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;

// Game state variables
let gameState = Array(6).fill(' ').map(() => Array(7).fill(' '));
let currentPlayer = 'red';
let history = [];
let finished = false;

const saveFilePath = './savedGameState.json';

// Middleware to serve static files from "public" folder
app.use(express.json());
app.use(express.static(__dirname + '/public'));

// Load the saved game state from the file (if it exists)
function loadSavedGameState() {
    if (fs.existsSync(saveFilePath)) {
        const data = fs.readFileSync(saveFilePath, 'utf-8');
        const { gameState: loadedGameState, currentPlayer: loadedCurrentPlayer, history: loadedHistory, finished: loadedFinished } = JSON.parse(data);
        gameState = loadedGameState;
        currentPlayer = loadedCurrentPlayer;
        history = loadedHistory;
        finished = loadedFinished;
    }
}

// Save the current game state to the file
function saveGameStateToFile() {
    const data = JSON.stringify({ gameState, currentPlayer, history, finished });
    fs.writeFileSync(saveFilePath, data, 'utf-8');
}

// Initialize by loading the saved game state
loadSavedGameState();

// API endpoints
app.get('/gameState', (req, res) => {
    res.json({ gameState, currentPlayer, history, finished });
});

app.post('/gameState', (req, res) => {
    const { newGameState, newCurrentPlayer, newHistory, newFinished } = req.body;
    gameState = newGameState;
    currentPlayer = newCurrentPlayer;
    history = newHistory;
    finished = newFinished;

    saveGameStateToFile();
    res.sendStatus(200);
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
