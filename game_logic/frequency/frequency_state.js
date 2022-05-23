const state = {
  1: {
    name: "GAME_SETUP",
    description: "Game is setting up",
    type: "automated",
    actions: ["setupNewGame"],
    transitions: {
      PSYCHIC_PHASE: 2
    }
  },
  2: {
    name: "PSYCHIC_PHASE",
    description: function (activeTeam) {
      return (`${activeTeam} Team Psychic must give a clue`);
    },
    type: "activePlayer",
    possibleActions: ["giveClue"],
    actions: ["giveClue"],
    transitions: {
      TEAM_PHASE: 3
    }
  },
  3: {
    name: "TEAM_PHASE",
    type: "multipleActivePlayer",
    description: function (activeTeam) {
      return (`${activeTeam} must discuss and turn dial`);
    },
    possibleActions: ["makeGuess"],
    actions: ['makeGuess'],
    transitions: {
      LEFT_RIGHT_PHASE: 4
    }
  },
  4: {
    name: "LEFT_RIGHT_PHASE",
    type: "multipleActivePlayer",
    possibleActions: ["chooseLeftRight"],
    actions: ["chooseLeftRight"],
    description: function (activeTeam) {
      return (`${activeTeam} must guess left or right`);
    },
    transitions: {
      SCORE_PHASE: 5
    }
  },
  5: {
    name: "SCORE_PHASE",
    type: "automated",
    actions: ["scorePoints"],
    transitions: {
      ROUND_SETUP: 10,
      GAME_END: 99
    }
  },
  10: {
    name: "ROUND_SETUP",
    type: "automated",
    actions: ["setupNewRound"],
    transitions: {
      PSYCHIC_PHASE: 2
    }
  },
  99: {
    name: "GAME_END",
    type: "automated",
    actions: ["gameEnd"]
  }
};


module.exports = state;