/*----- constants -----*/
// By convention, constants are written in SCREAMING_SNAKE_CASE
const PLAYERS = {
	playerOne: {
		name: 'Player 1',
		token: 'X',
		tokenClass: 'token-x',
		wins: 0,
	},
	playerTwo: {
		name: 'Player 2',
		token: 'O',
		tokenClass: 'token-o',
		wins: 0,
	},
};

const WINNING_COMBINATIONS = [
	0b000000111, 0b000111000, 0b111000000, 0b100100100, 0b010010010, 0b001001001,
	0b100010001, 0b001010100,
];

/*----- app's state (variables) -----*/
let currentPlayer;
let winState;
let moves;

/*----- cached element references -----*/
const gameBoard = document.querySelector('#grid');
const resetBtn = document.querySelector('button');
const boardBoxes = document.querySelectorAll('.box');
const h2El = document.querySelector('h2');

/*----- event listeners -----*/
// gameBoard.addEventListener('click', handleClick); // Moved to init()
resetBtn.addEventListener('click', init);

/*----- functions -----*/
function handleClick(event) {
	// Identify which box was clicked
	const clickedBox = event.target.id;

	if (!moves[clickedBox]) {
		// Record all moves
		moves[clickedBox] = currentPlayer.token;
		// Update display
		updateGameBoard(clickedBox, currentPlayer.tokenClass);
		// Check if current player has winning combination
		if (checkWinner(currentPlayer.token)) {
			gameBoard.removeEventListener('click', handleClick); // End game
			// Notify winner
			h2El.innerText = `${currentPlayer.name} Wins!`;
			h2El.classList.add('winner');
		} else {
			// Continue with next player
			switchCurrentPlayer();
		}
	} else {
		alert('That box is already taken!');
		// Do nothing
	}
}

// Manually kick off the game
init();

function init(event) {
	gameBoard.addEventListener('click', handleClick);
	updateGameBoard(); // No args clears boxes
	switchCurrentPlayer(); // currentPlayer = PLAYERS.playerOne;
	winState = false;
	moves = new Array(9).fill(null);
}

function switchCurrentPlayer() {
	// Toggle between players
	if (currentPlayer === PLAYERS.playerOne) {
		currentPlayer = PLAYERS.playerTwo;
		h2El.innerText = PLAYERS.playerTwo.name;
	} else {
		// This is also the initial case
		currentPlayer = PLAYERS.playerOne;
		h2El.innerText = PLAYERS.playerOne.name;
	}
	// Also return styling to normal
	h2El.classList.remove('winner');
}

function updateGameBoard(box = null, token = null) {
	if (!box) {
		// Clear all
		boardBoxes.forEach((boxEl) => {
			boxEl.classList.remove(PLAYERS.playerOne.tokenClass);
			boxEl.classList.remove(PLAYERS.playerTwo.tokenClass);
		});
	} else {
		// updates the GUI boxes with players' tokens
		boardBoxes[box].classList.add(token);
	}
}

function checkWinner(token) {
	let movesBin = 0;
	// Converts moves[] to an int number comparable to WINNING_COMBINATIONS
	// for example: [X,X,O,X,O,O,X,O,O] => 0b110100100 (for token X)
	// where 1 representes the current token
	moves.forEach((move) => {
		move = move === token ? 1 : 0;
		movesBin = (movesBin << 1) + move;
	});
	// console.log('0b' + movesBin.toString(2)); // Print in binary
	return WINNING_COMBINATIONS.some((combination) => {
		return (movesBin & combination) === combination;
	});
}
