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


router.patch('/:code', passport.authenticate("jwt", { session: false }), (req, res) => {
  let io = req.app.get("io");

  TakingSixModel.findOne({ code: req.params.code })
    .then(game => {

      const g = new games.TakingSixGame(game);

      try {
        const player = req.user;
        g.handleEvent(req.body.action, { ...req.body, player } );
      } catch (err) {
        console.error(err);
      }
      game.set(g);
      game.save()
      .then(assets => {
        const gameState = takingSixState[assets.currentState];
        try {
          io.to(req.params.code).emit("game_updated", { assets, gameState });
          console.log("working");
        } catch (e) {
          console.log(`error ${e}`);
        }
        res.json("success");
      });
    })
    .catch(err => res.status(404).json(["Game Not Found"]));
});

module.exports = router;