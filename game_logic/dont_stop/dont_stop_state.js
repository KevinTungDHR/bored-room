const state = {
  1: {
    name: "GAME_SETUP",
    description: "Game is setting up",
    type: "automated",
    actions: ["setupNewGame"],
    transitions: {
      DICE_REVEAL: 2
    }
  },
  2: {
    name: "DICE_REVEAL",
    description: function (activePlayer) {
      return (`${activePlayer} must choose a combination of dice`);
    },
    type: "activePlayer",
    possibleActions: ["chooseDice"],
    actions: ["chooseDice"],
    transitions: {
      CLIMB_PHASE: 3
    }
  },
  3: {
    name: "CLIMB_PHASE",
    type: "activePlayer",
    description: function (activePlayer) {
      return (`${activePlayer} must choose to continue or stop`);
    },
    possibleActions: ["continue", "stopClimb"],
    actions: ['continue', 'stopClimb'],
    transitions: {
      DICE_REVEAL: 2,
      FAIL_CLIMB: 4,
      END_TURN: 5,
    }
  },
  4: {
    name: "FAIL_CLIMB",
    type: "automated",
    actions: ["setupNewTurn"],
    description: "Bust! No possible dice combinations.",
    transitions: {
      DICE_REVEAL: 2,
    }
  },
  5: {
    name: "END_TURN",
    type: "automated",
    actions: ["setupNewTurn"],
    transitions: {
      DICE_REVEAL: 2,
      GAME_END: 99
    }
  },
  99: {
    name: "GAME_END",
    actions: ["gameEnd"]
  }
};


module.exports = state;