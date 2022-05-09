const takingSixState = require('./taking_six_state');

class TakingSixGame {
  constructor(options){
    this.deck = options.deck;
    
    this.currentPlayer = options.currentPlayer;
    this.players = options.players;
    this.currentState = options.currentState;
      
  }

  setupNewGame(players, options){
    this.name = "Taking Six";
    this.deck = await Card.find();
    this.shuffleCards();

    players.forEach((player) => {
      this.players.push({
       id: player.id,
       activePlayer: false,
       score: 66,
       pile: [],
       hand: this.deck.splice(0, 11)
      });
    });
  }

  shuffleCards(){
    // Fisher-Yates shuffle. Make sure to skip the first element for more even randomness.
    for(let i = this.deck.length - 1; i > 0; i--){
      let randomIdx = Math.floor(Math.random() * i);
      [this.deck[i], this.deck[randomIdx]] = [this.deck[randomIdx], this.deck[i]];
    }
  }

  setupNewRound(){

  }

  playCard(args){

  }

  takeRow(){

  }

  placeCardInRow(){

  }


}

module.exports = TakingSixGame