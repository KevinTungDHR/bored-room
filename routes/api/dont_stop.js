const express = require("express");
const router = express.Router();
const Room = require("../../models/Room");
const mongoose = require('mongoose');
const passport = require('passport');
const DontStopGame = require('../../game_logic/dont_stop/dont_stop_game');
const DontStopModel = require('../../game_logic/dont_stop/models/game');
const dontStopState = require('../../game_logic/dont_stop/dont_stop_state')

router.post('/createDemo', async (req, res) => {
  let io = req.app.get("io");

  const g = new DontStopGame();

  const bots = await User.find({handle: /DemoBot1/ });
  await Room.findOneAndUpdate({ code: req.body.code }, 
    { $push: { seatedUsers: { $each: bots }}})
  
  g.setupDemoGame(req.body.users, bots)
    .then(() => {
      const gameModel = DontStopModel({
        code: req.body.code,
        name: g.name,
        demoGame: g.demoGame,
        teamGame: g.teamGame,
        currentPlayer: g.currentPlayer,
        turnCounter: g.turnCounter,
        turnOrder: g.turnOrder,
        dice: g.dice,
        pairs: g.pairs,
        players: g.players,
        routes: g.routes,
        currentRun: g.currentRun,
        board: g.board,
        winner: g.winner,
        gameOver: g.gameOver,
        currentState: g.currentState,
      });

      const gameState = dontStopState[gameModel.currentState];

      gameModel.save()
        .then(assets => {

          io.to(req.body.code).emit("game_created", { assets, gameState });
          Room.findOneAndUpdate({ code: req.body.code }, { gameStarted: true }, {
            new: true
          })
          .populate("seatedUsers", ["handle", "eloRating", "avatar"])
          .then(room => io.to(req.body.code).emit("game_started", room));
            
          res.json("success");
        })
        .catch(err => res.status(422).json(err));
    })
    .catch(err => res.status(422).json(err));
});


router.post('/create', (req, res) => {
  let io = req.app.get("io");

  const g = new DontStopGame();

  g.setupNewGame(req.body.users)
    .then(() => {
      const gameModel = DontStopModel({
        code: req.body.code,
        name: g.name,
        demoGame: g.demoGame,
        teamGame: g.teamGame,
        currentPlayer: g.currentPlayer,
        turnCounter: g.turnCounter,
        turnOrder: g.turnOrder,
        dice: g.dice,
        pairs: g.pairs,
        players: g.players,
        routes: g.routes,
        currentRun: g.currentRun,
        board: g.board,
        winner: g.winner,
        gameOver: g.gameOver,
        currentState: g.currentState,
      });

      const gameState = dontStopState[gameModel.currentState];

      gameModel.save()
        .then(assets => {

          io.to(req.body.code).emit("game_created", { assets, gameState });
          Room.findOneAndUpdate({ code: req.body.code }, { gameStarted: true }, {
            new: true
          })
          .populate("seatedUsers", ["handle", "eloRating", "avatar"])
          .then(room => io.to(req.body.code).emit("game_started", room));
            
          res.json("success");
        })
        .catch(err => res.status(422).json(err));
    })
    .catch(err => res.status(401).json(err));
});

router.get('/:code', (req, res) => {
  DontStopModel.findOne({ code: req.params.code })
    .then(assets => {
      
      res.json({assets, gameState});
    })
    .catch(err => res.status(404).json(["Game Not Found"]));
});


router.patch('/:code', passport.authenticate("jwt", { session: false }), async (req, res) => {
  let io = req.app.get("io");
  let game = await DontStopModel.findOne({ code: req.params.code })

  if(!game){
    return res.status(404).json(["No game found"]);
  }
  let count = 0
  const g = new DontStopGame(game);
  const player = req.user;

  try {

    g.handleEvent(req.body.action, { ...req.body } );
    game.set(g);
    game.markModified('pairs')
    game.markModified('routes')
    game.markModified('currentRun');
    let assets = await game.save()
    const gameState = dontStopState[assets.currentState];

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
      game.markModified('pairs')
      game.markModified('routes')
      game.markModified('currentRun');

      let assets = await game.save()

      const gameState = dontStopState[assets.currentState];

      if(gameState.name === 'GAME_END'){
        await Room.findOneAndUpdate({ code: req.params.code }, { gameOver: true })
      }

      io.to(req.params.code).emit("game_updated", { assets, gameState });
    } catch (err) {
      return res.status(402).json(err);
    }

  }

  while(g.demoGame && g.currentPlayerIsBot() && count < 25) {
    count += 1;
    let action = g.getState().actions[0]

    if(g.getState()['name'] === 'CLIMB_PHASE'){
      action = g.botChooseClimbOrStop();
    }
    let routes;
    if(g.getState()['name'] === 'DICE_REVEAL'){
      routes = g.botChooseRandomRoute();
    }
    try {
      g.handleEvent(action, { routes: routes });

      game.set(g);
      let assets = await game.save()
      const gameState = dontStopState[assets.currentState];


      if(gameState.name === 'GAME_END'){
        await Room.findOneAndUpdate({ code: req.params.code }, { gameOver: true })
      }

      io.to(req.params.code).emit("game_updated", { assets, gameState, botTurn: true });
    } catch (err) {
      return res.status(402).json(err);
    }

  }
  res.json("success")
});

module.exports = router;