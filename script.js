var playerRange = 1;
var pairRange = 5;
var foundPairs = 0;
var players = [];
var activePlayer = 0;
var playerPoints = {};
var gameOver = false;
var countUpDate = new Date().getTime();
var now = new Date().getTime();
var emojis = [
  "&#9875",
  "&#9889",
  "&#9917",
  "&#9918",
  "&#9924",
  "&#9925",
  "&#9961",
  "&#9962",
  "&#9968",
  "&#9969",
  "&#9976",
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

function setPairRange() {
  pairRange = document.getElementById("pairRange").value;
  document.getElementById("outputPairSize").innerHTML = pairRange;
}

function setPlayerRange() {
  let temp = playerRange;
  playerRange = document.getElementById("playerRange").value;
  document.getElementById("outputPlayerSize").innerHTML = playerRange;
  let playerNameDiv = document.getElementById("playerNames");

  if (temp < playerRange) {
    let div = document.createElement("div");
    let tag = document.createElement("p");
    let text = document.createTextNode("Player " + playerRange);
    let input = document.createElement("input");
    let label = document.createElement("lavel");
    input.setAttribute("type", "text");
    input.setAttribute("id", "player" + playerRange);
    input.value = "Player " + playerRange;
    input.addEventListener("input", setPlayerName);
    label.innerHTML = "Name: ";
    tag.appendChild(text);
    div.appendChild(tag);
    div.appendChild(label);
    div.appendChild(input);
    playerNameDiv.appendChild(div);
  } else if (temp > playerRange) {
    playerNameDiv.removeChild(playerNameDiv.lastChild);
  }
}

// currently not used
function setPlayerName(e) {
  console.log(e.target.value);
}

function startGame() {
  for (let i = 0; i < playerRange; i++) players[i] = document.getElementById("player" + (i + 1)).value;
  for (let i = 1; i <= playerRange; i++) addPlayers(i);

  let configuration = document.getElementById("configuration");
  configuration.style.display = "none";

  let game = document.getElementById("game");
  game.style.display = "block";

  let pairSize = document.getElementById("outputPairSize").innerHTML;
  fillUsedEmojiList();
  for (let i = 0; i < players.length; i++) playerPoints[i] = 0;
  countUpDate = new Date().getTime();
  now = new Date().getTime();
  gameOver = false;
  document.getElementById("time").innerHTML = 0 + "m " + 0 + "s ";

  createBoard(pairSize);
}

var usedEmojis = [];

function fillUsedEmojiList() {
  for (let i = 0; i < pairRange * 2; i += 2) {
    let emoji = getNewRandomEmoji();
    usedEmojis[i] = emoji;
    usedEmojis[i + 1] = emoji;
  }

  shuffleArr(usedEmojis);
  console.log(usedEmojis);
}

function shuffleArr(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

getNewRandomEmoji = function () {
  let emoji;
  do {
    emoji = emojis[Math.floor(Math.random() * emojis.length)];
  } while (usedEmojis.includes(emoji));

  return emoji;
};

function createBoard(pairSize) {
  let board = document.getElementById("board");
  for (let i = 0; i < pairSize * 2; i++) {
    let div = document.createElement("div");
    div.classList.add("memory-card");
    let frontFace = document.createElement("div");
    let backFace = document.createElement("div");
    frontFace.classList.add("front-face");
    backFace.classList.add("back-face");

    let tagFront = document.createElement("p");
    tagFront.innerHTML = usedEmojis[i];
    tagFront.classList.add("emoji");

    let tagBack = document.createElement("p");
    tagBack.innerHTML = "&#129412;";
    tagBack.classList.add("emoji");

    frontFace.appendChild(tagFront);
    backFace.appendChild(tagBack);
    div.appendChild(frontFace);
    div.appendChild(backFace);
    div.setAttribute("id", "card" + i);
    div.addEventListener("click", flipCard);
    div.addEventListener("transitionend", checkCards);

    board.appendChild(div);
  }
}

function addPlayers(playerId) {
  let playerAvatars = document.getElementById("playerAvatars");
  let div = document.createElement("div");
  let tag = document.createElement("p");
  let text = document.createTextNode("P" + playerId + ": " + players[playerId - 1]);
  tag.appendChild(text);
  div.appendChild(tag);
  div.classList.add("player");
  div.setAttribute("id", "player" + playerId);
  playerAvatars.appendChild(div);
}

function resetSettings() {
  document.getElementById("pairRange").value = 5;
  setPairRange();

  document.getElementById("playerRange").value = 1;
  setPlayerRange();

  let playerNameDiv = document.getElementById("playerNames");
  playerNameDiv.innerHTML = "";
  let div = document.createElement("div");
  let tag = document.createElement("p");
  let text = document.createTextNode("Player " + playerRange);
  let input = document.createElement("input");
  let label = document.createElement("label");
  input.setAttribute("type", "text");
  input.setAttribute("id", "player" + playerRange);
  input.addEventListener("input", setPlayerName);
  label.innerHTML = "Name: ";
  tag.appendChild(text);
  div.appendChild(tag);
  div.appendChild(label);
  div.appendChild(input);
  playerNameDiv.appendChild(div);
}

var flippedCards = {};
var flippedCounter = 0;

function flipCard() {
  if (flippedCards[0] != this.id && flippedCards[1] != this.id) {
    this.classList.toggle("flip");
    flippedCards[flippedCounter] = this.id;
    flippedCounter++;
  }
}

function checkCards() {
  if (flippedCounter == 2) {
    console.log("checking cards, currect active player: " + activePlayer);
    let firstFlipped = document.getElementById(flippedCards[0]);
    let secondFlipped = document.getElementById(flippedCards[1]);
    if (firstFlipped.innerHTML == secondFlipped.innerHTML) {
      firstFlipped.removeEventListener("click", flipCard);
      secondFlipped.removeEventListener("click", flipCard);
      playerPoints[activePlayer] += 1;
      console.log(playerPoints);
      foundPairs++;
      if (foundPairs == pairRange) determineWinner();
    } else {
      firstFlipped.classList.toggle("flip");
      secondFlipped.classList.toggle("flip");
      activePlayer = (activePlayer + 1) % players.length;
      console.log("changing players! Playing: " + activePlayer);
    }
    flippedCounter = 0;
    flippedCards = {};
  }
}

function sleep(seconds) {
  var waitUntil = new Date().getTime() + seconds * 1000;
  while (new Date().getTime() < waitUntil) true;
}

function determineWinner() {
  let highestPoints = 0;
  let bestPlayers = [];
  let isDraft = false;
  for (let i = 0; i < players.length; i++) {
    if (playerPoints[i] > highestPoints) {
      isDraft = false;
      highestPoints = playerPoints[i];
      bestPlayers = [];
      bestPlayers.push(i);
    } else if (playerPoints[i] == highestPoints) {
      isDraft = true;
      highestPoints = playerPoints[i];
      bestPlayers.push(i);
    }
  }
  gameOver = true;
  if (isDraft) alert("Draft with " + highestPoints + " points!");
  else alert(players[bestPlayers[0]] + " won with " + highestPoints + " points!");
}

function resetGame() {
  let configuration = document.getElementById("configuration");
  configuration.style.display = "block";

  let game = document.getElementById("game");
  game.style.display = "none";

  playerRange = 1;
  pairRange = 5;
  foundPairs = 0;
  players = [];
  activePlayer = 0;
  playerPoints = {};
  usedEmojis = [];
  flippedCards = {};
  flippedCounter = 0;

  let board = document.getElementById("board");
  board.innerHTML = "";
  let playerAvatars = document.getElementById("playerAvatars");
  playerAvatars.innerHTML = "";
}

// Update the count down every 1 second
var x = setInterval(function () {
  // Get today's date and time
  now = new Date().getTime();

  // Find the distance between now and the count down date
  let distance = now - countUpDate;

  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  document.getElementById("time").innerHTML = minutes + "m " + seconds + "s ";

  // If the count down is finished, write some text
  if (gameOver) {
    clearInterval(x);
  }
}, 1000);
