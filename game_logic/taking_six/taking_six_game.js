const takingSixState = require('./taking_six_state');

class TakingSixGame {
  constructor(options){
    this.deck = options.deck;
    
    this.currentPlayer = options.currentPlayer;
    this.players = options.players
    this.currentState = options.currentState;
    
  }

  setupNewGame(){

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

// sampleState
game = {
  players: [
    {
      userId: Object.Id, // for user
      activePlayer: false,
    }
  ],
  hands: [],
  deck: [],
  
}