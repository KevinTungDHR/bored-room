const takingSixState = require('./taking_six_state');
const Card = require('./models/card');
const mongoose = require('mongoose');
const db = require('../../config/keys').mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));

class TakingSixGame {
  constructor(data){
    this.name = "Taking Six";
    if (data) {
      this.deck = data.deck;
      this.players = data.players;
      this.rows = data.rows;
    }
  }

  async setupNewGame(players){
    this.name = "Taking Six";

    await Card.find()
      .then(data => this.deck = (data))
      .catch(reason => console.error(reason));
    
    this.shuffleCards();
    this.players = [];
    players.forEach((player) => {
      this.players.push({
       id: player.id,
       activePlayer: false,
       score: 66,
       pile: [],
       hand: this.deck.splice(0, 11)
      });
    });

    // Create 4 rows
    this.rows = [];
    for(let i = 0; i < 4; i++){
      this.rows.push([this.deck.pop()]);
    }
  }

  shuffleCards(){
    // Fisher-Yates shuffle. Make sure to skip the first element for more even randomness.
    for(let i = this.deck.length - 1; i > 0; i--){
      let randomIdx = Math.floor(Math.random() * i);
      [this.deck[i], this.deck[randomIdx]] = [this.deck[randomIdx], this.deck[i]];
    }
  }

  handleEvent(action, args){
    if (!this.gameState.action.includes(action)){
      return "Not a valid action";
    }

    game[action](args);
  }

  setupNewRound(){

  }

  // User actions

  playCard(args){

  }

  takeRow(){

  }


  placeCardInRow(){

  }

  // Game State Actions

}


game = new TakingSixGame();
game.setupNewGame([{ id: 1 }, {id: 2 }, { id: 3 }])
  .then(() => console.log(game.rows));


module.exports = TakingSixGame;