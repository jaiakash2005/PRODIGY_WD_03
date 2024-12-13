const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restart-btn');
const modeSelector = document.getElementById('mode');
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameMode = 'human';
const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// Initialize the game
function init() {
  cells.forEach(cell => cell.addEventListener('click', handleClick));
  restartBtn.addEventListener('click', restartGame);
  modeSelector.addEventListener('change', () => {
    gameMode = modeSelector.value;
    restartGame();
  });
  updateStatus();
}

// Handle cell click
function handleClick(event) {
  const index = event.target.getAttribute('data-index');
  if (board[index] !== '') return;

  board[index] = currentPlayer;
  event.target.textContent = currentPlayer;
  event.target.classList.add('taken');

  if (checkWin(currentPlayer)) {
    updateStatus(`${currentPlayer} wins!`);
    endGame();
  } else if (board.every(cell => cell !== '')) {
    updateStatus("It's a draw!");
    endGame();
  } else {
    if (gameMode === 'ai' && currentPlayer === 'X') {
      currentPlayer = 'O';
      updateStatus(`AI's turn`);
      setTimeout(aiMove, 500); // Slight delay for AI move
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      updateStatus(`Player ${currentPlayer}'s turn`);
    }
  }
}

// AI makes a move
function aiMove() {
  const emptyCells = board
    .map((value, index) => (value === '' ? index : null))
    .filter(index => index !== null);

  const bestMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  board[bestMove] = currentPlayer;
  cells[bestMove].textContent = currentPlayer;
  cells[bestMove].classList.add('taken');

  if (checkWin(currentPlayer)) {
    updateStatus(`${currentPlayer} wins!`);
    endGame();
  } else if (board.every(cell => cell !== '')) {
    updateStatus("It's a draw!");
    endGame();
  } else {
    currentPlayer = 'X';
    updateStatus(`Player ${currentPlayer}'s turn`);
  }
}

// Check if a player has won
function checkWin(player) {
  return winningCombos.some(combo =>
    combo.every(index => board[index] === player)
  );
}

// Update game status
function updateStatus(message) {
  statusText.textContent = message || `Player ${currentPlayer}'s turn`;
}

// End the game
function endGame() {
  cells.forEach(cell => cell.removeEventListener('click', handleClick));
}

// Restart the game
function restartGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('taken');
  });
  updateStatus();
  init();
}

// Start the game
init();
