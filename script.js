var playerRange = 1;
var pairRange = 5;
var players = {};

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
    if (flippedCounter == 2) {
      flippedCounter = 0;
      flippedCards = {};
    }
    this.classList.toggle("flip");
    flippedCards[flippedCounter] = this.id;
    flippedCounter++;
  }
}

function checkCards() {
  if (flippedCounter == 2) {
    let firstFlipped = document.getElementById(flippedCards[0]);
    let secondFlipped = document.getElementById(flippedCards[1]);
    let board = document.getElementById("board");
    if (firstFlipped.innerHTML == secondFlipped.innerHTML) {
      firstFlipped.removeEventListener("click", flipCard);
      secondFlipped.removeEventListener("click", flipCard);
    } else {
      firstFlipped.classList.toggle("flip");
      secondFlipped.classList.toggle("flip");
    }
  }
}

function sleep(seconds) {
  var waitUntil = new Date().getTime() + seconds * 1000;
  while (new Date().getTime() < waitUntil) true;
}
