const express = require("express");
const router = express.Router();
const Room = require("../../models/Room");
const mongoose = require('mongoose');
const passport = require('passport');
const FrequencyGame = require('../../game_logic/frequency/frequency_game');
const FrequencyModel = require('../../game_logic/frequency/models/game');
const frequencyState = require('../../game_logic/frequency/frequency_state');

router.post('/createDemo', async (req, res) => {
  let io = req.app.get("io");

  const g = new FrequencyGame();
  const bots = await User.find({handle: /DemoBot/ });
  const teams = req.body.teams;

  let redStart;
  if(Object.values(teams.redTeam).length === 0){
    await Room.findOneAndUpdate({ code: req.body.code }, 
      { $push: { blueTeam: bots[0] }})
    await Room.findOneAndUpdate({ code: req.body.code }, 
      { $push: { redTeam: { $each: bots.slice(1) }}})
    teams.blueTeam.push(bots[0]);
    teams.redTeam.push(bots.slice(1));
    redStart = false;
  } else {
    await Room.findOneAndUpdate({ code: req.body.code }, 
      { $push: { redTeam: bots[0] }})
    await Room.findOneAndUpdate({ code: req.body.code }, 
      { $push: { blueTeam: { $each: bots.slice(1) }}})
    redStart = true;
    teams.redTeam.push(bots[0]);
    teams.blueTeam.push(...bots.slice(1));
  }

  g.setupDemoGame(teams, redStart)
    .then(() => {
      const gameModel = FrequencyModel({
        code: req.body.code,
        name: g.name,
        teamGame: g.teamGame,
        deck: g.deck,
        currentCard: g.currentCard,
        discard: g.discard,
        activeTeam: g.activeTeam,
        redTeam: g.redTeam,
        blueTeam: g.blueTeam,
        redPsychic: g.redPsychic,
        bluePsychic: g.bluePsychic,
        bluePoints: g.bluePoints,
        redPoints: g.redPoints,
        redGainedPts: g.redGainedPts,
        blueGainedPts: g.blueGainedPts,
        guess: g.guess,
        clue: g.clue,
        dial: g.dial,
        dialRevealed: g.dialRevealed,
        demoGame: g.demoGame,
        demoTurnCounter: g.demoTurnCounter,
        leftOrRight: g.leftOrRight,
        rerolls: g.rerolls,
        gameOver: g.gameOver,
        currentState: g.currentState,
      });

      const gameState = frequencyState[gameModel.currentState];

      gameModel.save()
        .then(assets => {

          io.to(req.body.code).emit("game_created", { assets, gameState });
          Room.findOneAndUpdate({ code: req.body.code }, { gameStarted: true }, {
            new: true
          })
          .populate("seatedUsers", ["handle", "eloRating", "avatar"])
          .populate("redTeam")
          .populate("blueTeam")
          .then(room => io.to(req.body.code).emit("game_started", room));
            
          res.json("success");
        })
        .catch(err => res.status(422).json(err));
    });
});


router.post('/create', (req, res) => {
  let io = req.app.get("io");

  const g = new FrequencyGame();

  g.setupNewGame(req.body.teams)
    .then(() => {
      const gameModel = FrequencyModel({
        code: req.body.code,
        name: g.name,
        teamGame: g.teamGame,
        deck: g.deck,
        currentCard: g.currentCard,
        discard: g.discard,
        activeTeam: g.activeTeam,
        redTeam: g.redTeam,
        blueTeam: g.blueTeam,
        redPsychic: g.redPsychic,
        bluePsychic: g.bluePsychic,
        bluePoints: g.bluePoints,
        redPoints: g.redPoints,
        redGainedPts: g.redGainedPts,
        blueGainedPts: g.blueGainedPts,
        guess: g.guess,
        clue: g.clue,
        dial: g.dial,
        leftOrRight: g.leftOrRight,
        dialRevealed: g.dialRevealed,
        demoGame: g.demoGame,
        demoTurnCounter: g.demoTurnCounter,
        rerolls: g.rerolls,
        gameOver: g.gameOver,
        currentState: g.currentState,
      });

      const gameState = frequencyState[gameModel.currentState];

      gameModel.save()
        .then(assets => {

          io.to(req.body.code).emit("game_created", { assets, gameState });
          Room.findOneAndUpdate({ code: req.body.code }, { gameStarted: true }, {
            new: true
          })
          .populate("seatedUsers", ["handle", "eloRating", "avatar"])
          .populate("redTeam")
          .populate("blueTeam")
          .then(room => io.to(req.body.code).emit("game_started", room));
            
          res.json("success");
        })
        .catch(err => res.status(422).json(err));
    });
});

router.get('/:code', (req, res) => {
  FrequencyModel.findOne({ code: req.params.code })
    .then(assets => {
      
      const gameState = frequencyState[assets.currentState];

      res.json({assets, gameState});
    })
    .catch(err => res.status(404).json(["Game Not Found"]));
});


router.patch('/:code', passport.authenticate("jwt", { session: false }), async (req, res) => {
  let io = req.app.get("io");

  let game = await FrequencyModel.findOne({ code: req.params.code })
  
  if(!game){
    return res.status(404).json(["No game found"]);
  }
  let count = 0
  const g = new FrequencyGame(game);
  const player = req.user;

  try {
    g.handleEvent(req.body.action, { ...req.body, player } );
    
    game.set(g);

    let assets = await game.save()
    const gameState = frequencyState[assets.currentState];

    if(gameState.name === 'GAME_END'){
      await Room.findOneAndUpdate({ code: req.params.code }, { gameOver: true })
    }

    io.to(req.params.code).emit("game_updated", { assets, gameState });
  } catch (err) {
    return res.status(402).json(err);
  }

  while(g.getState()['type'] === "automated" && count < 25){
    count += 1;
    let action = g.getState().actions[0]
    try {
      g.handleEvent(action);

      game.set(g);
      game.markModified('deck');
      let assets = await game.save()

      const gameState = frequencyState[assets.currentState];

      if(gameState.name === 'GAME_END'){
        await Room.findOneAndUpdate({ code: req.params.code }, { gameOver: true })
      }

      io.to(req.params.code).emit("game_updated", { assets, gameState });
    } catch (err) {
      return res.status(402).json(err);
    }
  }

  // Need to check if bot turn
  while(g.demoGame && !g.userIsActivePlayer(req.user._id) && g.getState()['name'] !== 'REVEAL_PHASE' && count < 25){
    count += 1;
    let action = g.getState().actions[0]
    try {
      g.handleEvent(action, { botTurn: true });

      game.set(g);
      game.markModified('deck');
      let assets = await game.save()
      const gameState = frequencyState[assets.currentState];

      if(gameState.name === 'GAME_END'){
        await Room.findOneAndUpdate({ code: req.params.code }, { gameOver: true })
        // Why do you need await?
      }

      io.to(req.params.code).emit("game_updated", { assets, gameState, botTurn: true });
    } catch (err) {
      return res.status(402).json(err);
    }
  }

  res.json("success")
});

module.exports = router;