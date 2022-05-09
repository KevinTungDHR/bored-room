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
      this.gameOver = data.gameOver;
      this.playedCards = data.playedCards;
    }
  }

  async setupNewGame(players){
    this.name = "Taking Six";
    this.playedCards = [];
    this.rows = [];
    this.players = [];

    await Card.find()
      .then(data => this.cleanDeck = (data))
      .catch(reason => console.error(reason));
      
    this.deck = this.cleanDeck.slice();

    this.shuffleCards();
    players.forEach((player) => {
      this.players.push({
       id: player.id,
       activePlayer: false,
       score: 66,
       pile: [],
       hand: this.deck.splice(0, 11),
       choosenCard: null
      });
    });

    
    // Create 4 rows
    for(let i = 0; i < 4; i++){
      this.rows.push([this.deck.pop()]);
    }

    this.gameOver = false;
  }

  shuffleCards(){
    // Fisher-Yates shuffle. Make sure to skip the first element for more even randomness.
    for(let i = this.deck.length - 1; i > 0; i--){
      let randomIdx = Math.floor(Math.random() * i);
      [this.deck[i], this.deck[randomIdx]] = [this.deck[randomIdx], this.deck[i]];
    }
  }

  setState(nextState){
    this.currentState = nextState;
  }

  // Main function to handle player input, is this necessary?
  handleEvent(action, args){
    if (!this.gameState.action.includes(action)){
      return "Not a valid action";
    }

    switch(action){
      case "playcard":

      default:
        break;
    }
  }

  // Automated Actions
  setupNewRound(){
    this.deck = this.cleanDeck;
    this.players.forEach((player) => {
      player.pile = [];
      player.hand = this.deck.splice(0, 11);
      player.chooseCard = null;
    });
  }

  calculateScores(){
    this.players.forEach(player => {
      const bulls = player.pile
        .map(card => card.bulls)
        .reduce((prev, curr) => prev + curr);
      player.score -= bulls;
    });
  }

  isRoundOver(){
    return this.players.every(player => player.hand.length === 0);
  }

  isGameOver(){
    return this.players.some(player => player.score <= 0);
  }

  orderPlayedCards(){
    this.playedCards.sort((a, b) => (a.value < b.value) ? -1 : 1);
  }

  playersHavenChosenCards() {
    return this.players.every(player => player.choosenCard !== null);
  }

  // Game Rules checks
  cardSmallerThanAllRows(card){
    return this.rows.every(row => row.slice(-1).value > card.value);
  }

  findClosestRow(card){
    let rowNum = 0;
    let diff = 104;
    for(let i = 0; i < this.rows.length; i++){
      const lastCardInRow = this.rows[i].slice(-1);
      if(lastCardInRow.value > card.value && 
        lastCardInRow.value - card.value < diff){
          rowNum = i;
          diff = lastCardInRow.value - card.value;
      }
    }

    return rowNum;
  }


  // User actions
  addCardToRow(card, rowNum){
    if (card.value < this.row[rowNum].value){
      throw "Card is smaller than row value";
    }
    this.rows[rowNum].push(card);
  }

  takeFullRow(player, rowNum){
    player.pile.push.apply(player.pile, this.rows[rowNum].splice(0,5));
  }

  takeAllRowCards(player, rowNum){
    player.pile.push.apply(player.pile, this.rows[rowNum].splice());
  }

  chooseCard(player, card) {
    const selectedPlayer = this.players.filter((p) => p.id ===  player.id)[0];
    selectedPlayer.choosenCard = card;
  }


  // State Management Actions
  playCard(data){
    this.chooseCard(data.player, data.card);
    if (playersHavenChosenCards()){
      const nextState = takingSixState[this.currentState.STATE_NEXT];
      this.setState(nextState);
    }
  }


}


game = new TakingSixGame();
game.setupNewGame([{ id: 1 }, {id: 2 }, { id: 3 }])
  .then(() => console.log(game.rows));


module.exports = TakingSixGame;