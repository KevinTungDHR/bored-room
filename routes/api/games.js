const express = require("express");
const router = express.Router();
const Room = require("../../models/Room");
const mongoose = require('mongoose');
const passport = require('passport');
const TakingSixModel = require('../../game_logic/taking_six/models/game');
const takingSixState = require('../../game_logic/taking_six/taking_six_state');
const games = require('../../game_logic/all_games');

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

router.get('/:code', (req, res) => {
  TakingSixModel.findOne({ code: req.params.code })
    .then(assets => {
      
      const gameState = takingSixState[assets.currentState];

      res.json({assets, gameState});
    })
    .catch(err => res.status(404).json(["Game Not Found"]));
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
      let assets = await game.save()
      const gameState = takingSixState[assets.currentState];
      io.to(req.params.code).emit("game_updated", { assets, gameState });
    } catch (err) {
      return res.status(402).json(err);
    }
  }

  res.json("success")
});

module.exports = router;