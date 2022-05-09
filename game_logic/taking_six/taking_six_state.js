state = {
  1: {
    name: "GAME_SETUP",
    description: "Game is setting up",
    type: "automated",
    actions: ["setupNewGame"],
    transitions: {
      PLAYER_CHOOSE_CARD: 2
    }
  },
  2: {
    name: "PLAYER_CHOOSE_CARD",
    description: "Players must choose a card",
    type: "multipleActivePlayer",
    actions: ["playCard"],
    transitions: {
      TAKE_ROW: 3,
      AUTO_PLACE_CARD: 4
    }
  },
  3: {
    name: "TAKE_ROW",
    type: "activePlayer",
    actions: ["takeRow"],
    description: function(activePlayer) {
      return (`${activePlayer} must take a row`);
    },
    transitions: {
      TAKE_ROW: 3,
      AUTO_PLACE_CARD: 4,
    }
  },
  4: {
    name: "AUTO_PLACE_CARD",
    type: "automated",
    transitions: {
      AUTO_PLACE_CARD: 4,
      CHECK_FULL_ROW: 5,
      ROUND_SETUP: 10
    }
  },
  5: {
    name: "CHECK_FULL_ROW",
    type: "automated",
    transitions: {
      
    }
  }
};

// console.log(state[3].description("Jon"));