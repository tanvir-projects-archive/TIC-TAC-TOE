const boardElement = document.getElementById("board");
const messageElement = document.getElementById("message");
const resetButton = document.getElementById("reset-btn");
const pvpButton = document.getElementById("pvp-mode");
const pvcButton = document.getElementById("pvc-mode");
const modeDisplay = document.getElementById("mode-display");

let board = Array(9).fill(null);
let currentPlayer = "X";
let gameMode = "pvp"; // pvp = Player vs Player, pvc = Player vs Computer
let gameActive = true;

// Create the board dynamically
function renderBoard() {
  boardElement.innerHTML = "";
  board.forEach((value, index) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    if (value) cell.classList.add("taken");
    cell.textContent = value || "";
    cell.addEventListener("click", () => handleCellClick(index));
    boardElement.appendChild(cell);
  });
}

// Handle cell clicks
function handleCellClick(index) {
  if (!gameActive || board[index]) return;
  board[index] = currentPlayer;
  renderBoard();
  checkWinner();

  if (gameMode === "pvc" && gameActive) {
    setTimeout(computerMove, 500); // Add delay for computer move
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
  }
}

// Computer's move (random for simplicity)
function computerMove() {
  const emptyCells = board.map((val, idx) => (val === null ? idx : null)).filter((val) => val !== null);
  if (emptyCells.length > 0) {
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[randomIndex] = "O";
    renderBoard();
    checkWinner();
  }
}

// Check for a winner or draw
function checkWinner() {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6], // Diagonals
  ];

  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      messageElement.textContent = `${board[a]} wins!`;
      gameActive = false;
      return;
    }
  }

  if (board.every((cell) => cell)) {
    messageElement.textContent = "It's a draw!";
    gameActive = false;
  }
}

// Reset the game
function resetGame() {
  board = Array(9).fill(null);
  currentPlayer = "X";
  gameActive = true;
  messageElement.textContent = "";
  renderBoard();
}

// Switch game mode
function switchMode(mode) {
  gameMode = mode;
  modeDisplay.textContent = mode === "pvp" ? "Player vs Player" : "Player vs Computer";
  resetGame();
}

// Initialize
resetButton.addEventListener("click", resetGame);
pvpButton.addEventListener("click", () => switchMode("pvp"));
pvcButton.addEventListener("click", () => switchMode("pvc"));
renderBoard();
