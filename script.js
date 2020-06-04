var playerRange = 1;
var pairRange = 5;

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
    var tag = document.createElement("p");
    var text = document.createTextNode("Player " + playerRange + ": placeholder");
    tag.appendChild(text);
    playerNameDiv.appendChild(tag);
  } else if (temp > playerRange) {
    playerNameDiv.removeChild(playerNameDiv.lastChild);
  }
}
