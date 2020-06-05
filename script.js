var playerRange = 1;
var pairRange = 5;
var players = {};

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

  let x = document.getElementById("configuration");
  x.style.display = "none";

  let pairSize = document.getElementById("outputPairSize").innerHTML;
  createBoard(pairSize);
}

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
    tagFront.innerHTML = "&#127752;";
    tagFront.classList.add("emoji");

    let tagBack = document.createElement("p");
    tagBack.innerHTML = "&#129409;";
    tagBack.classList.add("emoji");

    frontFace.appendChild(tagFront);
    backFace.appendChild(tagBack);
    div.appendChild(frontFace);
    div.appendChild(backFace);
    div.addEventListener("click", flipCard);

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

const cards = document.querySelectorAll(".memory-card");

function flipCard() {
  this.classList.toggle("flip");
}

cards.forEach((card) => card.addEventListener("click", flipCard));
