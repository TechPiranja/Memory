var playerRange = 1;
var pairRange = 5;
var foundPairs = 0;
var players = [];
var activePlayer = 0;
var playerScore = {};
var playerTries = {};
var gameOver = false;
var countUpDate = new Date().getTime();
var now = new Date().getTime();
var lockActions = false;
var totalTries = 0;
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
var usedEmojis = [];

function setPairRange() {
  pairRange = document.getElementById("pairRange").value;
  document.getElementById("outputPairSize").innerHTML = pairRange;
}

function setPlayerRange() {
  let temp = playerRange;
  playerRange = document.getElementById("playerRange").value;
  document.getElementById("outputPlayerSize").innerHTML = playerRange;
  let playerNameDiv = document.getElementById("playerNames");
  let loopCount = Math.abs(temp - playerRange);
  for (let i = 0; i < loopCount; i++) {
    if (temp < playerRange) {
      temp++;
      let div = document.createElement("div");
      let tag = document.createElement("p");
      let text = document.createTextNode("Player " + temp);
      let input = document.createElement("input");
      let label = document.createElement("lavel");
      input.setAttribute("type", "text");
      input.setAttribute("id", "player" + temp);
      input.value = "Player " + temp;
      input.addEventListener("input", setPlayerName);
      label.innerHTML = "Name: ";
      tag.appendChild(text);
      div.appendChild(tag);
      div.appendChild(label);
      div.appendChild(input);
      div.classList.add("playerSetup");
      playerNameDiv.appendChild(div);
    } else if (temp > playerRange) {
      playerNameDiv.removeChild(playerNameDiv.lastChild);
      temp--;
    }
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

  let gameScreen = document.getElementById("gameScreen");
  gameScreen.style.display = "block";

  fillUsedEmojiList();
  playerScore = new Array(players.length).fill(0);
  playerTries = new Array(players.length).fill(0);
  document.getElementById("time").innerHTML = 0 + "m " + 0 + "s ";
  countUpDate = new Date().getTime();
  now = new Date().getTime();
  gameOver = false;
  timer();

  setActivePlayer(false);
  createBoard();
}

function fillUsedEmojiList() {
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

getNewRandomEmoji = function () {
  let emoji;
  do {
    emoji = emojis[Math.floor(Math.random() * emojis.length)];
  } while (usedEmojis.includes(emoji));

  return emoji;
};

function createBoard() {
  let board = document.getElementById("board");
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
}

function addPlayers(playerId) {
  let playerAvatars = document.getElementById("playerAvatars");
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

function resetSettings() {
  document.getElementById("pairRange").value = 5;
  setPairRange();

  document.getElementById("playerRange").value = 1;
  setPlayerRange();
}

var flippedCards = {};
var flippedCounter = 0;

function flipCard() {
  if (lockActions) return;
  if (flippedCards[0] != this.id && flippedCards[1] != this.id && flippedCounter < 2) {
    this.classList.toggle("flip");
    flippedCards[flippedCounter] = this.id;
    flippedCounter++;
  }
}

function checkCards() {
  if (flippedCounter == 2) {
    let firstFlipped = document.getElementById(flippedCards[0]);
    let secondFlipped = document.getElementById(flippedCards[1]);
    if (firstFlipped.innerHTML == secondFlipped.innerHTML) {
      firstFlipped.removeEventListener("click", flipCard);
      secondFlipped.removeEventListener("click", flipCard);
      foundPairs++;
      playerScore[activePlayer] += 1;
      document.getElementById("playerScore" + activePlayer).innerHTML = "Score: " + playerScore[activePlayer];
      if (foundPairs == pairRange) determineWinner();
    } else {
      lockActions = true;
      setTimeout(() => {
        firstFlipped.classList.toggle("flip");
        secondFlipped.classList.toggle("flip");

        lockActions = false;
        setActivePlayer(true);
      }, 800);
    }
    playerTries[activePlayer] += 1;
    document.getElementById("playerTries" + activePlayer).innerHTML = "Tries: " + playerTries[activePlayer];

    let totalTriesText = document.getElementById("totalTries");
    totalTries++;
    totalTriesText.innerHTML = "Total Tries: " + totalTries;
    flippedCounter = 0;
    flippedCards = {};
  }
}

function setActivePlayer(withChange) {
  if (gameOver) return;
  if (withChange) {
    let lastActivePlayerAvatar = document.getElementById("playerAvatar" + (activePlayer + 1));
    lastActivePlayerAvatar.classList.remove("active-player");
    activePlayer = (activePlayer + 1) % players.length;
  }
  var activeAvatar = document.getElementById("playerAvatar" + (activePlayer + 1));
  activeAvatar.classList.add("active-player");
}

function determineWinner() {
  let highestPoints = 0;
  let bestPlayers = [];
  let isDraft = false;
  for (let i = 0; i < players.length; i++) {
    if (playerScore[i] > highestPoints) {
      isDraft = false;
      highestPoints = playerScore[i];
      bestPlayers = [];
      bestPlayers.push(i);
    } else if (playerScore[i] == highestPoints) {
      isDraft = true;
      highestPoints = playerScore[i];
      bestPlayers.push(i);
    }
  }
  gameOver = true;

  document.getElementById("highestPoints").innerHTML = "Score: " + highestPoints;
  document.getElementById("winner").innerHTML = isDraft
    ? "Its a Draft between: " +
      bestPlayers.map((playerId) => {
        return " " + players[playerId];
      })
    : "The winner is: " + players[bestPlayers[0]];
  document.getElementById("playerTries").innerHTML = "Tries: " + highestPoints;
  document.getElementById("playTime").innerHTML = "Playtime: " + document.getElementById("time").innerHTML;
  document.getElementById("winnerPopup").style.display = "block";
}

// When the user clicks on <span> (x), close the modal
function closeModal() {
  document.getElementById("winnerPopup").style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  let modal = document.getElementById("winnerPopup");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

function resetGame() {
  gameOver = true;
  foundPairs = 0;
  activePlayer = 0;
  playerScore = {};
  playerTries = {};
  usedEmojis = [];
  flippedCards = {};
  flippedCounter = 0;
  totalTries = 0;

  let configuration = document.getElementById("configuration");
  configuration.style.display = "block";
  let gameScreen = document.getElementById("gameScreen");
  gameScreen.style.display = "none";
  let board = document.getElementById("board");
  board.innerHTML = "";
  let playerAvatars = document.getElementById("playerAvatars");
  playerAvatars.innerHTML = "";
}

function timer() {
  let x = setInterval(function () {
    now = new Date().getTime();
    let distance = now - countUpDate;
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);
    document.getElementById("time").innerHTML = minutes + "m " + seconds + "s ";

    if (gameOver) {
      clearInterval(x);
    }
  }, 1000);
}
