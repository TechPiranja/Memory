var playerRange = 1;
var pairRange = 5;
var foundPairs = 0;
var players = [];
var activePlayer = 0;
var playerScores = {};
var playerTries = {};
var gameOver = true;
var countUpDate = new Date().getTime();
var now = new Date().getTime();
var lockActions = false;
var totalTries = 0;
var flippedCards = {};
var flippedCounter = 0;
var emojis = [
	"&#9875",
	"&#9889",
	"&#9917",
	"&#9918",
	"&#9924",
	"&#9925",
	"&#9749",
	"&#9962",
	"&#9978",
	"&#128520",
	"&#128519",
	"&#11088",
	"&#127752",
	"&#127758",
	"&#127770",
	"&#127773",
	"&#127783",
	"&#127789",
	"&#127790",
	"&#127793",
	"&#127800",
	"&#127826",
	"&#127828",
	"&#127853",
	"&#127873",
	"&#127918",
	"&#128013",
	"&#128018",
	"&#128025",
	"&#128027",
	"&#128029",
	"&#128035",
	"&#129419",
	"&#128053",
	"&#128123",
	"&#128126",
	"&#128163",
	"&#128176",
	"&#128190",
	"&#128293",
	"&#128527",
	"&#129412",
];
var usedEmojis = [];

const playerNameDiv = document.getElementById("playerNames");
const configuration = document.getElementById("configuration");
const gameScreen = document.getElementById("gameScreen");
const board = document.getElementById("board");
const playerAvatars = document.getElementById("playerAvatars");
const totalTriesText = document.getElementById("totalTries");
const pairRangeSlider = document.getElementById("pairRange");
const outputPairSize = document.getElementById("outputPairSize");
const playerRangeSlider = document.getElementById("playerRange");
const outputPlayerSize = document.getElementById("outputPlayerSize");
const time = document.getElementById("time");

/* Popup Elements */
const highestPointsInfo = document.getElementById("highestPoints");
const winnerInfo = document.getElementById("winner");
const playerTriesInfo = document.getElementById("playerTries");
const playTimeInfo = document.getElementById("playTime");
const winnerPopup = document.getElementById("winnerPopup");

window.onresize = resizeBoard;

/* gets value from slider element
and sets it to pairRange var and on the p element */
function setPairRange() {
	pairRange = pairRangeSlider.value;
	outputPairSize.innerHTML = pairRange;
}

/* creates or removes playerNameDiv on playerRange change */
function setPlayerRange() {
	let temp = playerRange;
	playerRange = playerRangeSlider.value;
	outputPlayerSize.innerHTML = playerRange;
	let loopCount = Math.abs(temp - playerRange);
	for (let i = 0; i < loopCount; i++) {
		// adds playerNameDivs till its even to requested playerRange
		if (temp < playerRange) {
			temp++;
			let div = document.createElement("div");
			let tag = document.createElement("p");
			let text = document.createTextNode("Player " + temp);
			let input = document.createElement("input");
			let label = document.createElement("lavel");
			input.setAttribute("type", "text");
			input.setAttribute("id", "player" + temp);
			label.innerHTML = "Name: ";
			tag.appendChild(text);
			div.appendChild(tag);
			div.appendChild(label);
			div.appendChild(input);
			div.classList.add("playerSetup");
			playerNameDiv.appendChild(div);
		}
		// removes playerNameDivs till its even to requested playerRange
		else if (temp > playerRange) {
			playerNameDiv.removeChild(playerNameDiv.lastChild);
			temp--;
		}
	}
}

function startGame() {
	// gets all playerNames to display them on the gameScreen
	for (let i = 0; i < playerRange; i++) {
		let p = document.getElementById("player" + (i + 1)).value;
		// adds default names if there was no name given
		players[i] = p == "" ? "Player " + (i + 1) : p;
	}

	// adds player info (player avatar) to game board
	for (let i = 1; i <= playerRange; i++) addPlayers(i);

	// switching screens from configuration to gameScreen
	configuration.style.display = "none";
	gameScreen.style.display = "block";

	// gets random emojis from our preset and shuffles them
	fillEmojiList();

	// fill playerScores and playerTries with 0
	playerScores = new Array(players.length).fill(0);
	playerTries = new Array(players.length).fill(0);

	// reset time element
	time.innerHTML = 0 + "m " + 0 + "s ";
	countUpDate = new Date().getTime();
	now = new Date().getTime();
	gameOver = false;
	timer();

	// sets first active player
	setActivePlayer(false);

	// fills board dynamically with cards
	createBoard();
}

// adds single playerAvatar element to board
function addPlayers(playerId) {
	let div = document.createElement("div");
	let tagPlayerName = document.createElement("p");
	let textPlayerName = document.createTextNode(players[playerId - 1]);
	let tagScore = document.createElement("p");
	let textScore = document.createTextNode("Score: 0");
	tagScore.setAttribute("id", "playerScore" + (playerId - 1));
	let tagTries = document.createElement("p");
	let textTries = document.createTextNode("Tries: 0");
	tagTries.setAttribute("id", "playerTries" + (playerId - 1));
	tagPlayerName.appendChild(textPlayerName);
	tagScore.appendChild(textScore);
	tagTries.appendChild(textTries);
	div.appendChild(tagPlayerName);
	div.appendChild(tagScore);
	div.appendChild(tagTries);
	div.classList.add("player");
	div.classList.add("player" + playerId);
	div.setAttribute("id", "playerAvatar" + playerId);
	playerAvatars.appendChild(div);
}

// gets random emojis from our preset and shuffles them
function fillEmojiList() {
	for (let i = 0; i < pairRange * 2; i += 2) {
		let emoji = getNewRandomEmoji();
		usedEmojis[i] = emoji;
		usedEmojis[i + 1] = emoji;
	}
	shuffleArr(usedEmojis);
}

function shuffleArr(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * i);
		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
}

// gets random emoji (without duplication)
getNewRandomEmoji = function () {
	let emoji;
	do {
		emoji = emojis[Math.floor(Math.random() * emojis.length)];
	} while (usedEmojis.includes(emoji));

	return emoji;
};

// fills board dynamically with cards
function createBoard() {
	for (let i = 0; i < pairRange * 2; i++) {
		let div = document.createElement("div");
		div.classList.add("card");
		let frontFace = document.createElement("div");
		let backFace = document.createElement("div");
		frontFace.classList.add("front");
		backFace.classList.add("back");

		let tagFront = document.createElement("p");
		tagFront.innerHTML = usedEmojis[i];
		tagFront.classList.add("emoji");

		frontFace.appendChild(tagFront);
		div.appendChild(frontFace);
		div.appendChild(backFace);
		div.setAttribute("id", "card" + i);
		div.addEventListener("click", flipCard);
		div.addEventListener("transitionend", checkCards);
		board.appendChild(div);
	}

	resizeBoard();
}

function resizeBoard() {
	if (gameOver) return;
	let overflow = isOverflown(document.body);
	let cards = document.getElementsByClassName("card");
	console.log(overflow);
	while (overflow && gameScreen.offsetHeight + cards[0].clientHeight * 3 > document.body.clientHeight) {
		for (let i = 0; i < cards.length; i++) {
			cards[i].style.width = cards[i].clientWidth - 5;
			cards[i].style.height = cards[i].clientHeight - 5;
			cards[i].childNodes[0].childNodes[0].style.fontSize = cards[i].clientWidth * 0.7 + "px";
		}
		overflow = isOverflown(document.body);
	}

	while (!overflow && gameScreen.offsetHeight + cards[0].clientHeight * 3 < document.body.clientHeight) {
		for (let i = 0; i < cards.length; i++) {
			cards[i].style.width = cards[i].clientWidth + 5;
			cards[i].style.height = cards[i].clientHeight + 5;
			cards[i].childNodes[0].childNodes[0].style.fontSize = cards[i].clientWidth * 0.7 + "px";
		}
		overflow = isOverflown(document.body);
	}
}

function isOverflown(element) {
	return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

// resets configuration to default
function resetSettings() {
	pairRangeSlider.value = 5;
	setPairRange();
	playerRangeSlider.value = 1;
	setPlayerRange();
}

function flipCard() {
	if (lockActions) return;
	if (flippedCards[0] != this.id && flippedCards[1] != this.id && flippedCounter < 2) {
		this.classList.toggle("flip");
		flippedCards[flippedCounter] = this.id;
		flippedCounter++;
	}
}

// checks cards and gameOver
function checkCards() {
	if (flippedCounter == 2) {
		playerTries[activePlayer] += 1;
		document.getElementById("playerTries" + activePlayer).innerHTML = "Tries: " + playerTries[activePlayer];
		totalTries++;
		totalTriesText.innerHTML = "Total Tries: " + totalTries;

		let firstFlipped = document.getElementById(flippedCards[0]);
		let secondFlipped = document.getElementById(flippedCards[1]);
		// checks if both cards have the same emoji displayed
		if (firstFlipped.innerHTML == secondFlipped.innerHTML) {
			// removes EventListener so they can't be clicked anymore
			firstFlipped.removeEventListener("click", flipCard);
			secondFlipped.removeEventListener("click", flipCard);
			// increasing foundPairs and playerScore for activePlayer
			foundPairs++;
			playerScores[activePlayer] += 1;
			document.getElementById("playerScore" + activePlayer).innerHTML = "Score: " + playerScores[activePlayer];
			if (foundPairs == pairRange) determineWinner();
		} else {
			// locks board till the flip animation is finished
			lockActions = true;
			setTimeout(() => {
				firstFlipped.classList.toggle("flip");
				secondFlipped.classList.toggle("flip");

				lockActions = false;
				// sets new activePlayer
				setActivePlayer(true);
			}, 800);
		}

		// resets flippedCounter and flippedCards for new try.
		flippedCounter = 0;
		flippedCards = {};
	}
}

function setActivePlayer(withChange) {
	if (gameOver) return;
	if (withChange) {
		// changing to new active player and remove active-player style from old activePlayer
		// activePlayer Array starts at 0, the elements at 1, thats why activePlayer + 1 is used
		let lastActivePlayerAvatar = document.getElementById("playerAvatar" + (activePlayer + 1));
		lastActivePlayerAvatar.classList.remove("active-player");
		activePlayer = (activePlayer + 1) % players.length;
	}
	// adding active-player style to new activePlayer
	var activeAvatar = document.getElementById("playerAvatar" + (activePlayer + 1));
	activeAvatar.classList.add("active-player");
}

function determineWinner() {
	let highestPoints = 0;
	let bestPlayers = [];
	let isDraft = false;

	// determines highestPoints and if its a draft between multiple players
	for (let i = 0; i < players.length; i++) {
		if (playerScores[i] > highestPoints) {
			isDraft = false;
			highestPoints = playerScores[i];
			bestPlayers = [];
			bestPlayers.push(i);
		} else if (playerScores[i] == highestPoints) {
			isDraft = true;
			highestPoints = playerScores[i];
			bestPlayers.push(i);
		}
	}

	// filling info for winnerPopup element
	highestPointsInfo.innerHTML = "Score: " + highestPoints;
	winnerInfo.innerHTML = isDraft
		? "Its a Draft between: " +
		  bestPlayers.map((playerId) => {
				return " " + players[playerId];
		  })
		: "The winner is: " + players[bestPlayers[0]];
	playerTriesInfo.innerHTML = "Tries: " + playerTries[bestPlayers[0]];
	playTimeInfo.innerHTML = "Playtime: " + time.innerHTML;
	winnerPopup.style.display = "block";
	gameOver = true;
}

// When the user clicks on (x), close the popup
function closePopup() {
	winnerPopup.style.display = "none";
}

// When the user clicks anywhere outside of the popup, close it
window.onclick = function (event) {
	if (event.target == winnerPopup) {
		winnerPopup.style.display = "none";
	}
};

/* resets all game relevant vars,
clears board/avatars and switches back to configuration screen */
function resetGame() {
	gameOver = true;
	foundPairs = 0;
	activePlayer = 0;
	playerScores = {};
	playerTries = {};
	usedEmojis = [];
	flippedCards = {};
	flippedCounter = 0;
	totalTries = 0;

	configuration.style.display = "block";
	gameScreen.style.display = "none";
	board.innerHTML = "";
	playerAvatars.innerHTML = "";
	totalTriesText.innerHTML = "Total Tries: 0";
}

// updates timer element every second if the game is not over
function timer() {
	let x = setInterval(function () {
		now = new Date().getTime();
		let distance = now - countUpDate;
		let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		let seconds = Math.floor((distance % (1000 * 60)) / 1000);
		time.innerHTML = minutes + "m " + seconds + "s ";

		if (gameOver) {
			clearInterval(x);
		}
	}, 1000);
}
