// action will be called onEnter
const state = {
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
    possibleActions: ["playCard"],
    transitions: {
      CHECK_PLAYED_CARDS: 3
    }
  },
  3: {
    name: "CHECK_PLAYED_CARDS",
    type: "automated",
    description: "Game is checking played cards",
    actions: ['checkPlayedCards'],
    transitions: {
      TAKE_ROW: 4,
      AUTO_PLACE_CARD: 5,
    }
  },
  4: {
    name: "TAKE_ROW",
    type: "activePlayer",
    possibleActions: ["takeRow"],
    description: function(activePlayer) {
      return (`${activePlayer} must take a row`);
    },
    transitions: {
      CHECK_PLAYED_CARDS: 3
    }
  },
  5: {
    name: "AUTO_PLACE_CARD",
    type: "automated",
    action: ["autoPlaceCard"],
    transitions: {
      CHECK_PLAYED_CARDS: 3,
      CHECK_TURN_END: 7
    }
  },
  7: {
    name: "CHECK_TURN_END",
    type: "automated",
    actions: ['checkTurnEnd'],
    transitions: {
      PLAYER_CHOOSE_CARD: 2,
      ROUND_SETUP: 10,
      GAME_END: 99
    }
  },
  10: {
    name: "ROUND_SETUP",
    type: "automated",
    action: ["setupNewRound"],
    transitions: {
      PLAYER_CHOOSE_CARD: 2
    }
  },
  99: {
    name: "GAME_END",
    type: "automated",
    action: ["gameEnd"]
  }
};

// console.log(state[3].description("Jon"));

module.exports = state;