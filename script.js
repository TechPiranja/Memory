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

function setPlayerName(e) {
  console.log(e.target.value);
}

function startGame() {
  for (let i = 0; i < playerRange; i++) players[i] = document.getElementById("player" + (i + 1)).value;
  for (let i = 1; i <= playerRange; i++) addPlayers(i);

  let x = document.getElementById("configuration");
  x.style.display = "none";
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
