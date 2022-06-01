const takingSixState = require('./taking_six_state');
const Card = require('./models/card');
const mongoose = require('mongoose');
const User = require('../../models/User');
const db = require('../../config/keys').mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));

class TakingSixGame {
  constructor(data) {
    this.name = "Taking Six";
    if (data) {
      this.deck = data.deck;
      this.players = data.players;
      this.rows = data.rows;
      this.teamGame = data.teamGame;
      this.gameOver = data.gameOver;
      this.playedCards = data.playedCards;
      this.currentState = data.currentState;
    }
    this.getState = this.getState.bind(this);
  }

  async setupNewGame(players) {
    this.name = "Taking Six";
    this.teamGame = false;
    this.playedCards = [];
    this.rows = [];
    this.players = [];

    await Card.find()
      .then(data => this.deck = (data))
      .catch(reason => console.error(reason));

    this.shuffleCards();
    players.forEach((player) => {
      this.players.push({
        _id: player._id,
        bot: false,
        activePlayer: false,
        score: 66,
        pile: [],
        hand: this.deck.splice(0, 10),
        chosenCard: { value: -1, bulls: 0 },
        endingElo: 0
      });
    });

    this.orderPlayerHands();
    this.currentState = 2;
    // Create 4 rows
    for (let i = 0; i < 4; i++) {
      this.rows.push([this.deck.pop()]);
    }

    this.gameOver = false;
  }
  
  async setupDemoGame(players, bots){
    this.name = "Taking Six";
    this.teamGame = false;
    this.playedCards = [];
    this.rows = [];
    this.players = [];

    await Card.find()
      .then(data => this.deck = (data))
      .catch(reason => console.error(reason));

    this.shuffleCards();
    players.forEach((player) => {
      this.players.push({
        _id: player._id,
        bot: false,
        activePlayer: false,
        score: 66,
        pile: [],
        hand: this.deck.splice(0, 10),
        chosenCard: { value: -1, bulls: 0 },
        endingElo: 0
      });
    });

    bots.forEach((bot) => {
      this.players.push({
        _id: bot._id,
        bot: true,
        activePlayer: false,
        score: 66,
        pile: [],
        hand: this.deck.splice(0, 10),
        chosenCard: { value: -1, bulls: 0 },
        endingElo: 0
      });
    });

    this.orderPlayerHands();
    this.currentState = 2;
    // Create 4 rows
    for (let i = 0; i < 4; i++) {
      this.rows.push([this.deck.pop()]);
    }

    this.gameOver = false;
  }

  shuffleCards() {
    // Fisher-Yates shuffle. Make sure to skip the first element for more even randomness.
    for (let i = this.deck.length - 1; i > 0; i--) {
      let randomIdx = Math.floor(Math.random() * i);
      [this.deck[i], this.deck[randomIdx]] = [this.deck[randomIdx], this.deck[i]];
    }
  }

  setState(nextState) {
    this.currentState = nextState;
  }

  getState() {
    return takingSixState[this.currentState];
  }

  // Main function to handle player input, is this necessary?
  handleEvent(action, args) {
    if (this.getState().type === 'automated') {
      return this[action](args);
    }

    if (!this.getState().possibleActions.includes(action)) {
      return "Not a valid action";
    }

    if(this.getState().type === 'activePlayer'){
      if (!args.player._id.equals(this.getActivePlayer()._id)) {
        return;
      }
    }

    return this[action](args);
  }

  getActivePlayer() {
    for(let player of this.players){
      if(player.activePlayer) {
        return player;
      }
    }
  }


  // Automated Actions

  turnCleanUp() {
    this.players.forEach((player) => {
      player.chosenCard = { value: -1, bulls: 0 };
    });
  }

  calculateScore(player, cards) {
    const bulls = cards
      .map(card => card.bulls)
      .reduce((prev, curr) => prev + curr);
    player.score -= bulls;
  }

  isRoundOver() {
    return this.players.every(player => player.hand.length === 0);
  }

  isGameOver() {
    return this.players.some(player => player.score <= 0);
  }

  orderPlayedCards() {
    this.playedCards.sort((a, b) => (a[1].value < b[1].value) ? -1 : 1);
  }

  orderPlayerHands(){
    this.players.forEach(player => 
      player.hand.sort((a, b) => (a.value < b.value) ? -1 : 1)
      );
  }

  playersHaveChosenCards() {
    return this.players.every(player => player.chosenCard.value !== -1);
  }

  botsHaveChosenCards() {
    return this.players
      .filter(player => player.bot === true)
      .every(player => player.chosenCard.value !== -1);
  }

  botsChooseRandomCards(){
    this.players.forEach(player =>{
      if(player.bot === true){
        let randInt = Math.floor(Math.random() * player.hand.length);
        this.playCard({ player: player, card: player.hand[randInt] });
      }
    })
  }

  botTakesRow(){
    let smallestRow = 0;

    let leastPoints = this.rows[0].reduce((prev, curr) => {
      return prev.value + curr.value
    })
    for(let i = 1; i < this.rows.length; i++){
      let points = this.rows[i].reduce((prev, curr) => {
        return prev.value + curr.value
      })

      if(points < leastPoints){
        leastPoints = points;
        smallestRow = i;
      }
    }

    this.takeRow({row: smallestRow})
  }

  currentPlayerIsBot(){
    let currentPlayer = this.players.find(player => player._id.equals(this.playedCards[0][0]));
    return currentPlayer.bot
  }
  // Game Rules checks
  cardSmallerThanAllRows(card) {
    return this.rows.every(row => row.slice(-1)[0].value > card.value);
    // Could also use Array.at()
  }

  findClosestRow(card) {
    let rowNum = 0;
    let diff = 104;
    for (let i = 0; i < this.rows.length; i++) {
      const lastCardInRow = this.rows[i].slice(-1)[0];
      if (lastCardInRow.value < card.value &&
        card.value - lastCardInRow.value < diff) {
        rowNum = i;
        diff = card.value - lastCardInRow.value;
      }
    }

    return rowNum;
  }


  // User actions
  addCardToRow(card, rowNum) {
    this.rows[rowNum].push(card);
  }

  takeFullRow(player, rowNum) {
    const cards = this.rows[rowNum].splice(0, 5)
    this.calculateScore(player, cards)
    player.pile.push.apply(player.pile, cards);
  }

  takeAllRowCards(player, rowNum) {
    const cards = this.rows[rowNum].splice(0);
    this.calculateScore(player, cards)
    player.pile.push.apply(player.pile, cards);
  }

  chooseCard(player, card) {
    const selectedPlayer = this.players.filter((p) => {
      
      // _id is new Object_id
      return p._id.equals(player._id)})[0];
    selectedPlayer.chosenCard = card;
  }

  // State Actions
  playCard(data) {
    if(!data.card || data.card === -1){
      throw "Please select a card"
    }
    this.chooseCard(data.player, data.card);
    if (this.playersHaveChosenCards()) {
      this.players.forEach(player => {
        this.playedCards.push([player._id, player.chosenCard]);
        player.hand = player.hand.filter(card => card.value !== player.chosenCard.value)
      });
      this.orderPlayedCards();
      // Organize playedCards To keep track of playerId

      const nextState = this.getState().transitions.CHECK_PLAYED_CARDS;
      this.setState(nextState);
    }
  }

  checkPlayedCards() {
    const nextCard = this.playedCards[0][1];

    if (this.cardSmallerThanAllRows(nextCard)) {
      let currentPlayer = this.players.find(player => player._id.equals(this.playedCards[0][0]));
      currentPlayer.activePlayer = true;
      const nextState = this.getState().transitions.TAKE_ROW;
      this.setState(nextState);
    } else {
      const nextState = this.getState().transitions.AUTO_PLACE_CARD;
      this.setState(nextState);
    }
  }

  takeRow(data) {
    if (data.row == null){
      throw "Please choose a row";
    }
    const [playerId, card] = this.playedCards.shift();
    let player = this.players.find(p => p._id.equals(playerId));
    this.takeAllRowCards(player, data.row);
    this.addCardToRow(card, data.row);
    player.activePlayer = false;

    if (this.playedCards.length > 0) {
      const nextState = this.getState().transitions.CHECK_PLAYED_CARDS;
      this.setState(nextState);
    } else {
      const nextState = this.getState().transitions.CHECK_TURN_END;
      this.setState(nextState);
    }
  }

  autoPlaceCard() {
    const [playerId, card] = this.playedCards.shift();

    const rowNum = this.findClosestRow(card);
    this.addCardToRow(card, rowNum);

    if (this.rows[rowNum].length > 5) {
      const player = this.players.find(p => p._id.equals(playerId));
      this.takeFullRow(player, rowNum);
    }

    if (this.playedCards.length > 0) {
      const nextState = this.getState().transitions.CHECK_PLAYED_CARDS;
      this.setState(nextState);
    } else {
      const nextState = this.getState().transitions.CHECK_TURN_END;
      this.setState(nextState);
    }
  }
  
  checkWinner() {
    let tiedWinners = []
    let winner = this.players[0];
    this.players.forEach((player) => {
      if (winner.score < player.score){
        winner = player;
        tiedWinners = []
        tiedWinners.push(player);
      } else if (winner.score === player.score){
        tiedWinners.push(player)
      }
    });

    return tiedWinners;
  }

  changeElo() {
    let winners = this.checkWinner();
    const numPlayers = this.players.length - 1;
    const eloForWinner = numPlayers * 5;
    let eloWon = eloForWinner / winners.length;

    this.players.forEach((player) => {
      User.findById(player._id)
      .then((user) => {
        let originalElo = user.eloRating.takingSix;

        if(winners.some(winner => winner._id.equals(user._id))){
          const increasedElo = {eloRating: { takingSix: (originalElo + eloWon) }};
          player.endingElo = originalElo + eloWon;
          user.set(increasedElo)
        } else {
          const deductedElo = {eloRating: { takingSix: (originalElo - 5) }};
          player.endingElo = originalElo - 5;
          user.set(deductedElo)
        }
        user.save()
      })
    });

  }

  checkTurnEnd() {
    if (this.isRoundOver() && this.isGameOver()) {
      const nextState = this.getState().transitions.GAME_END;
      this.changeElo();
      this.setState(nextState);
    } else if (this.isRoundOver()) {
      const nextState = this.getState().transitions.ROUND_SETUP;
      this.setState(nextState);
    } else {
      this.turnCleanUp()
      const nextState = this.getState().transitions.PLAYER_CHOOSE_CARD;
      this.setState(nextState);
    }
  }

  setupNewRound() {
    this.players.forEach((player) => {
      this.deck = this.deck.concat(player.pile);
      player.pile = [];
      player.chosenCard = { value: -1, bulls: 0 }
    });
    
    this.rows.forEach((row) => {
      this.deck = this.deck.concat(row)
    })

    this.rows = [];
    for (let i = 0; i < 4; i++) {
      this.rows.push([this.deck.pop()]);
    }

    this.players.forEach(player => player.hand = this.deck.splice(0, 10));
    this.orderPlayerHands();
    const nextState = this.getState().transitions.PLAYER_CHOOSE_CARD;
    this.setState(nextState);
  }
}

module.exports = TakingSixGame;