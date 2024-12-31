let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameOver = false;
let mode = 'pvp'; // Default mode: Player vs Player

// Get references to the HTML elements
const boardElement = document.getElementById('board');
const resetButton = document.getElementById('reset');
const modeSelector = document.getElementById('mode');
const messageElement = document.getElementById('message');

// Add event listeners
modeSelector.addEventListener('change', (event) => {
    mode = event.target.value;
    resetGame();
});
resetButton.addEventListener('click', resetGame);

// Render the board on the page
function renderBoard() {
    boardElement.innerHTML = '';
    board.forEach((cell, index) => {
        const box = document.createElement('div');
        box.classList.add('box');
        box.textContent = cell;
        box.addEventListener('click', () => handleMove(index));
        boardElement.appendChild(box);
    });
}

// Handle player's move
function handleMove(index) {
    if (board[index] === '' && !gameOver) {
        board[index] = currentPlayer;
        renderBoard();
        checkWinner();
        switchPlayer();
        if (mode === 'pvc' && currentPlayer === 'O' && !gameOver) {
            setTimeout(computerMove, 500); // Delay for computer move
        }
    }
}

// Switch the current player
function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

// Check if there's a winner or a draw
function checkWinner() {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameOver = true;
            messageElement.textContent = `Player ${board[a]} wins!`;
            return;
        }
    }

    if (board.every(cell => cell !== '')) {
        gameOver = true;
        messageElement.textContent = 'It\'s a draw!';
    }
}

// Computer's move (using Minimax Algorithm)
function computerMove() {
    const bestMove = findBestMove();
    board[bestMove] = 'O';
    renderBoard();
    checkWinner();
    switchPlayer();
}

// Minimax algorithm to find the best move
function findBestMove() {
    let bestScore = -Infinity;
    let move = -1;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'O'; // Simulate computer's move
            let score = minimax(board, 0, false);
            board[i] = ''; // Undo the move
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

// Minimax algorithm to calculate scores
function minimax(board, depth, isMaximizing) {
    const winner = getWinner();
    if (winner) {
        if (winner === 'O') return 10 - depth; // Favor fast wins
        if (winner === 'X') return depth - 10; // Favor delaying opponent wins
        return 0; // Draw
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Utility function to get the winner
function getWinner() {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    if (board.every(cell => cell !== '')) {
        return 'draw';
    }
    return null;
}

// Reset the game
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameOver = false;
    messageElement.textContent = '';
    renderBoard();
}

// Initial render
renderBoard();
