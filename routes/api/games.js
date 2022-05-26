const express = require("express");
const router = express.Router();
const Room = require("../../models/Room");
const mongoose = require('mongoose');
const passport = require('passport');
const TakingSixModel = require('../../game_logic/taking_six/models/game');
const takingSixState = require('../../game_logic/taking_six/taking_six_state');
const games = require('../../game_logic/all_games');
const User = require("../../models/User");


router.post('/createDemo', async (req, res) => {
  let io = req.app.get("io");

  const g = new games.TakingSixGame();

  const bots = await User.find({handle: /DemoBot/ });
  await Room.findOneAndUpdate({ code: req.body.code }, 
    { $push: { seatedUsers: { $each: bots }}})

  g.setupDemoGame(req.body.users, bots)
    .then(() => {
      const gameModel = TakingSixModel({
        code: req.body.code,
        name: g.name,
        deck: g.deck,
        players: g.players,
        playedCards: g.playedCards,
        rows: g.rows,
        currentState: g.currentState,
      });

      const gameState = takingSixState[gameModel.currentState];

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
    });
});


router.post('/create', (req, res) => {
  let io = req.app.get("io");

  const g = new games.TakingSixGame();

  g.setupNewGame(req.body.users)
    .then(() => {
      const gameModel = TakingSixModel({
        code: req.body.code,
        name: g.name,
        deck: g.deck,
        players: g.players,
        playedCards: g.playedCards,
        rows: g.rows,
        currentState: g.currentState,
      });

      const gameState = takingSixState[gameModel.currentState];

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
    });
});

router.get('/:code', async (req, res) => {
  try {
    const assets = await TakingSixModel.findOne({ code: req.params.code })
    const gameState = takingSixState[assets.currentState];
  
    if(gameState.description instanceof Function){
      const g = new games.TakingSixGame(assets);
      const user = await User.findById(g.getActivePlayer()._id)
      gameState.description = gameState.description(user.handle);
    }
  
    res.json({assets, gameState});
  } catch (err){
    res.status(422).json(err)
  }

});


router.patch('/:code', passport.authenticate("jwt", { session: false }), async (req, res) => {
  let io = req.app.get("io");

  let game = await TakingSixModel.findOne({ code: req.params.code })
  
  if(!game){
    return res.status(404).json(["No game found"]);
  }
  let count = 0
  const g = new games.TakingSixGame(game);
  const player = req.user;

  try {
    g.handleEvent(req.body.action, { ...req.body, player } );
    game.set(g);
    let assets = await game.save()
    const gameState = takingSixState[assets.currentState];

    if(gameState.description instanceof Function){
      const user = await User.findById(g.getActivePlayer()._id)
      gameState.description = gameState.description(user.handle);
    }

    io.to(req.params.code).emit("game_updated", { assets, gameState });
  } catch (err) {
    return res.status(402).json(err);
  }

  if(g.getState()['name'] === 'PLAYER_CHOOSE_CARD' && !g.botsHaveChosenCards()){
    try {
      g.botsChooseRandomCards();
      game.set(g);
      let assets = await game.save()
      const gameState = takingSixState[assets.currentState];
      if(gameState.description instanceof Function){
        const user = await User.findById(g.getActivePlayer()._id)
        gameState.description = gameState.description(user.handle);
      }
      
      io.to(req.params.code).emit("game_updated", { assets, gameState });
    } catch (err){
      res.status(422).json(err)
    }
  }

  while((g.getState()['type'] === "automated" && count < 25) || 
      (g.getState()['name'] === 'TAKE_ROW' && g.currentPlayerIsBot())){
    count += 1;

    if (g.getState()['type'] === "automated"){
      let action = g.getState().actions[0]
      try {
        g.handleEvent(action);
        game.set(g);
        let assets = await game.save()
        const gameState = takingSixState[assets.currentState];
        if(gameState.description instanceof Function){
          const user = await User.findById(g.getActivePlayer()._id)
          gameState.description = gameState.description(user.handle);
        }
        
        io.to(req.params.code).emit("game_updated", { assets, gameState });
      } catch (err) {
        return res.status(402).json(err);
      }
    } else {
      try {
        g.botTakesRow();
        game.set(g);
        let assets = await game.save()
        const gameState = takingSixState[assets.currentState];
  
        if(gameState.description instanceof Function){
          const user = await User.findById(g.getActivePlayer()._id)
          gameState.description = gameState.description(user.handle);
        }
        io.to(req.params.code).emit("game_updated", { assets, gameState });
      } catch (err){
        res.status(422).json(err)
      }
    }
  }
  
  res.json("success")
});

module.exports = router;