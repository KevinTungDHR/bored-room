const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const TakingSixModel = require('../../game_logic/taking_six/models/game');
const takingSixState = require('../../game_logic/taking_six/taking_six_state');
const games = require('../../game_logic/all_games');

router.post('/create', (req, res) => {
  const g = new games.TakingSixGame();

  g.setupNewGame(req.body.users)
    .then(() => {
      const gameModel = TakingSixModel({
        name: g.name,
        deck: g.deck,
        players: g.players,
        playedCards: g.playedCards,
        rows: g.rows,
        currentState: g.currentState,
      });

      const gameState = takingSixState[g.currentState]

      gameModel.save()
        .then(assets => res.json({assets, gameState}))
        .catch(err => res.status(422).json(err));
    });
});

router.get('/:id', (req, res) => {
  TakingSixModel.findById(req.params.id)
    .then(assets => {
      const gameState = takingSixState[g.currentState]

      res.json({assets, gameState})
    })
    .catch(err => res.status(404).json(["Game Not Found"]));
})


router.patch('/:id', (req, res) => {
  TakingSixModel.findById(req.params.id)
    .then(assets => {

      const g = new games.TakingSixGame(assets);

      try {
        g.handleEvent(req.body.action, req.body);
      } catch (err) {
        console.error(err)
      }
      game.set(g);
      game.save();
      const gameState = takingSixState[g.currentState]
      res.json({assets, gameState})
    })
    .catch(err => res.status(404).json(["Game Not Found"]));
});

module.exports = router;