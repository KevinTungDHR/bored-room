const mongoose = require("mongoose");
const TakingSixModel = require('./models/game');
const db = require('../../config/keys').mongoURI;
const User = require('../../models/User');
const Game = require('./taking_six_game');

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));


const g = new Game();

User.find()
  .then(users => {
  g.setupNewGame([users[0], users[1]])
    .then(() => {
      const gameModel = TakingSixModel({
        name: g.name,
        deck: g.deck,
        players: g.players,
        playedCards: g.playedCards,
        rows: g.rows,
        currentState: g.currentState
      });

      gameModel.save()
        .then(() => {
          mongoose.connection.close();
        });
    });
});

