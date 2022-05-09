state = {
  1: {
    name: "Game Setup",
    description: "Game is setting up",
    type: "automated",
    action: "gameSetup",
    transitions: {
      "": 'STATE_PLAYER_PLAY_CARD'
    }
  },
  2: {
    name: "STATE_PLAYER_PLAY_CARD",
    description: "Players must choose a card",
    type: "playerAction",
    action: "playCard",
    transitions: {

    }
  },
  3: {
    name: "STATE_TAKE_ROW",
    type: "playerAction",
    action: "takeRow",
    description: function(activePlayer) {
      return (`${activePlayer} must take a row`)
    }
  }
}

console.log(state[3].description("Jon"))