const frequencyState = require('./frequency_state');
const Card = require('./models/card');
const User = require('../../models/User');
const mongoose = require('mongoose');
const db = require('../../config/keys').mongoURI;
const { demo_cards } = require('./demo_cards')
const { demo_clues } = require('./demo_clues')
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));


class FrequencyGame {
  constructor(data){
    this.name = "Frequency";
    this.teamGame = true;
    if(data){
      this.demoGame = data.demoGame;
      this.deck = data.deck;
      this.currentCard = data.currentCard;
      this.discard = data.discard;
  
      this.rerolls = data.rerolls;
      this.activeTeam = data.activeTeam;
      this.redTeam = data.redTeam;
      this.blueTeam = data.blueTeam;
      this.redPsychic = data.redPsychic;
      this.bluePsychic = data.bluePsychic;
      this.dial = data.dial;
      this.guess = data.guess;
      this.clue = data.clue;
      this.redPoints = data.redPoints;
      this.bluePoints = data.bluePoints;
      this.redGainedPts = data.redGainedPts;
      this.blueGainedPts = data.blueGainedPts;
      this.leftOrRight = data.leftOrRight;
      this.dialRevealed = data.dialRevealed;
      this.demoTurnCounter = data.demoTurnCounter;
      this.winner = data.winner;

      this.currentState = data.currentState;
      this.gameOver = data.gameOver;
    }

    this.getState = this.getState.bind(this);
  }

  async setupNewGame({redTeam, blueTeam}){
    this.name = "Frequency";
    this.teamGame = true;
    this.demoGame = false;
    this.discard = [];
    this.redTeam = [];
    this.blueTeam = [];
    this.redPsychic = 0;
    this.bluePsychic = 0;
    this.redPoints = 0;
    this.bluePoints = 0;
    this.redGainedPts = 0;
    this.blueGainedPts = 0;
    this.guess = 90;
    this.clue = null;
    this.dial = null;
    this.leftOrRight = null;
    this.dialRevealed = false;
    this.demoTurnCounter = 0;
    this.rerolls = 0;
    this.winner = null;


    await Card.find()
    .then(data => this.deck = (data))
    .catch(reason => console.error(reason));

    redTeam.forEach((player) => {
      this.redTeam.push({
        _id: player._id,
        activePlayer: false,
        isPsychic: false,
        endingElo: 0
      })
    })

    blueTeam.forEach((player) => {
      this.blueTeam.push({
        _id: player._id,
        activePlayer: false,
        isPsychic: false,
        endingElo: 0
      })
    })
    this.shuffleTeam(this.redTeam);
    this.shuffleTeam(this.blueTeam)
    this.selectRandomStartTeam();
    this.selectStartingPsychic();
    this.setRandomDial()
    this.shuffleCards();
    this.currentCard = this.deck.pop();
    this.currentState = 2;
    this.gameOver = false;
  }

  async setupDemoGame({redTeam, blueTeam}, redStart){
    this.name = "Frequency";
    this.teamGame = true;
    this.demoGame = true;
    this.discard = [];
    this.redTeam = [];
    this.blueTeam = [];
    this.redPsychic = 0;
    this.bluePsychic = 0;
    this.redPoints = 0;
    this.bluePoints = 0;
    this.redGainedPts = 0;
    this.blueGainedPts = 0;
    this.guess = 90;
    this.clue = null;
    this.dial = null;
    this.leftOrRight = null;
    this.dialRevealed = false;
    this.demoTurnCounter = 0;
    this.rerolls = 0;
    this.winner = null;

    this.deck = demo_cards.slice(0).reverse();

    redTeam.forEach((player) => {
      this.redTeam.push({
        _id: player._id,
        activePlayer: false,
        isPsychic: false,
        endingElo: 0
      })
    })

    blueTeam.forEach((player) => {
      this.blueTeam.push({
        _id: player._id,
        activePlayer: false,
        isPsychic: false,
        endingElo: 0
      })
    })

    this.activeTeam = redStart ? 'red' : 'blue'
    this.selectStartingPsychic();
    this.dial = demo_clues[this.demoTurnCounter].dial;
    this.currentCard = this.deck.pop();
    this.currentState = 2;
    this.gameOver = false;
  }

  selectRandomStartTeam() {
    this.activeTeam = Math.random() < 0.5 ? 'red' : 'blue'
  }

  selectStartingPsychic(){
    if(this.activeTeam === 'red'){
      this.redTeam[this.redPsychic].isPsychic = true;
      this.redTeam[this.redPsychic].activePlayer = true;
    } else {
      this.blueTeam[this.bluePsychic].isPsychic = true;
      this.blueTeam[this.bluePsychic].activePlayer = true;
    }
  }

  setActiveTeam(team){
    team.forEach(player => {
      player.activePlayer = true
    })
  }

  setActivePlayersFalse(team){
    team.forEach(player => player.activePlayer = false)
  }

  shuffleCards() {
    // Fisher-Yates shuffle. Make sure to skip the first element for more even randomness.
    for (let i = this.deck.length - 1; i > 0; i--) {
      let randomIdx = Math.floor(Math.random() * i);
      [this.deck[i], this.deck[randomIdx]] = [this.deck[randomIdx], this.deck[i]];
    }
  }

  shuffleTeam(team) {
    // Fisher-Yates shuffle. Make sure to skip the first element for more even randomness.
    for (let i = team.length - 1; i > 0; i--) {
      let randomIdx = Math.floor(Math.random() * i);
      [team[i], team[randomIdx]] = [team[randomIdx], team[i]];
    }
  }

  setState(nextState) {
    this.currentState = nextState;
  }

  getState() {
    return frequencyState[this.currentState];
  }

  getActivePlayers(){
    const teams = this.redTeam.concat(this.blueTeam);
    return teams.filter(player => player.activePlayer).map(player => player._id);
  }

  userIsActivePlayer(userId){
    const ids = this.getActivePlayers();
    return ids.some(id => id.equals(userId));
  }

  rerollCard(){
    if(this.rerolls > 2 || this.demoGame){
      throw 'No rerolls left';
    }

    this.discard.push(this.currentCard)
    this.currentCard = this.deck.pop();
    this.rerolls += 1;
    this.setRandomDial();
  }

  checkGuess(guess){
    switch(true){
      case (guess >= this.dial - 2 && guess <= this.dial + 2):
        return 4;
      case ((guess >= this.dial - 7 && guess <= this.dial - 3) || 
        (guess >= this.dial + 3 && guess <= this.dial + 7)):
        return 3;
      case ((guess >= this.dial - 12 && guess <= this.dial - 8) || 
        (guess >= this.dial + 8 && guess <= this.dial + 12)):
        return 2;
      default:
        return 0;
    }
  }

  checkLeftOrRight(){
    if(this.guess >= this.dial - 2 && this.guess <= this.dial + 2){
      return 0;
    }

    if(this.guess < this.dial && this.leftOrRight === 'right'){
      return 1;
    }

    if(this.guess > this.dial && this.leftOrRight === 'left'){
      return 1;
    }

    return 0;
  }

  isGameOver(){
    return ((this.redPoints >= 10 || this.bluePoints >= 10) && this.redPoints !== this.bluePoints)
  }

  newTurnSetup(){
    this.discard.push(this.currentCard)
    this.currentCard = this.deck.pop();
    this.clue = null;
    this.leftOrRight = null;
    this.guess = 90;
    this.dialRevealed = false;
    this.redGainedPts = 0;
    this.blueGainedPts = 0;
    this.rerolls = 0;

    if(this.demoGame){
      this.demoTurnCounter += 1;
      this.dial = demo_clues[this.demoTurnCounter].dial
    } else {
      this.setRandomDial();
    }
  }

  randomGuess(){
    if(Math.random() < 0.75){
      this.guess = (Math.floor(Math.random() * 25) + this.dial - 12)
    } else {
      this.guess = Math.floor(Math.random() * 181)
    }
  }
  randomLeftOrRight(){
    this.leftOrRight = Math.random() < 0.5 ? 'left' : 'right'
  }

  setNewRedPsychic(){
    this.blueTeam[this.bluePsychic % this.blueTeam.length].isPsychic = false
    this.redTeam[this.redPsychic % this.redTeam.length].isPsychic = false
    this.redPsychic += 1;
    let newPsychic = this.redTeam[this.redPsychic % this.redTeam.length]
    newPsychic.isPsychic = true;
    newPsychic.activePlayer = true;
}

  setNewBluePsychic() {
    this.redTeam[this.redPsychic % this.redTeam.length].isPsychic = false
    this.blueTeam[this.bluePsychic % this.blueTeam.length].isPsychic = false
    this.bluePsychic += 1;
    let newPsychic = this.blueTeam[this.bluePsychic % this.blueTeam.length]
    newPsychic.isPsychic = true;
    newPsychic.activePlayer = true;
  }

  switchTurn(){
    if(this.activeTeam === 'red'){
      this.setActivePlayersFalse(this.blueTeam);
      this.setNewBluePsychic()
      this.activeTeam = 'blue';
    } else {
      this.setActivePlayersFalse(this.redTeam);
      this.setNewRedPsychic()
      this.activeTeam = 'red';
    }

    this.newTurnSetup()
  }

  activeTeamGoesAgain(){
    if(this.activeTeam === 'red'){
      this.setActivePlayersFalse(this.blueTeam);
      this.setNewRedPsychic()
    } else {
      this.setActivePlayersFalse(this.redTeam);
      this.setNewBluePsychic()
    }

    this.newTurnSetup()
  }

  handleEvent(action, args) {
    if (this.getState().type === 'automated') {
      return this[action](args);
    }

    if (!this.getState().possibleActions.includes(action)) {
      return "Not a valid action";
    }

    if(this.getState().type === 'activePlayer'){
      // Check activePlayer
    }

    return this[action](args);
  }

  setRandomDial(){
    this.dial = Math.floor(Math.random() * 181);
  }

  // State Actions Below

  giveClue(data) {
    if(data.botTurn){
      this.clue = demo_clues[this.demoTurnCounter].clue
    } else {
      this.clue = data.clue;
    }
  
    if(this.activeTeam === 'red'){
      this.setActiveTeam(this.redTeam);
      this.redTeam[this.redPsychic % this.redTeam.length].activePlayer = false;
    } else {
      this.setActiveTeam(this.blueTeam);
      this.blueTeam[this.bluePsychic % this.blueTeam.length].activePlayer = false;
    }

    const nextState = this.getState().transitions.TEAM_PHASE;
    this.setState(nextState);
  }

  makeGuess(data){
    if(data.botTurn){
      this.randomGuess()
    } else {

      this.guess = data.guess;
    }

    if(this.activeTeam === 'red'){
      this.setActivePlayersFalse(this.redTeam);
      this.setActiveTeam(this.blueTeam);
    } else {
      this.setActivePlayersFalse(this.blueTeam);
      this.setActiveTeam(this.redTeam);
    }

    const nextState = this.getState().transitions.LEFT_RIGHT_PHASE;
    this.setState(nextState);
  }

  chooseLeftRight(data){
    if(data.botTurn){
      this.randomLeftOrRight()
    } else {
      this.leftOrRight = data.leftOrRight;
    }

    const nextState = this.getState().transitions.SCORE_PHASE;
    this.setState(nextState);
  }

  scorePoints(data) {
    this.dialRevealed = true;
    let points = this.checkGuess(this.guess);

    if(this.activeTeam === 'red'){
      this.redPoints += points;
      this.bluePoints += this.checkLeftOrRight();
      this.redGainedPts = points;
      this.blueGainedPts = this.checkLeftOrRight();
    } else {
      this.bluePoints += points;
      this.redPoints += this.checkLeftOrRight();
      this.blueGainedPts = points;
      this.redGainedPts = this.checkLeftOrRight();
    }

    if(this.isGameOver()){
      this.gameOver = true;
      this.changeElo();
      const nextState = this.getState().transitions.GAME_END;
      this.setState(nextState);
    } else {
      const nextState = this.getState().transitions.REVEAL_PHASE;
      this.setState(nextState);
    }
  }

  nextRound(data){
    let points = this.checkGuess(this.guess);
    let [currentTeamPts, opposingTeamPts] = this.activeTeam === 'red' ? [this.redPoints, this.bluePoints] : [this.bluePoints, this.redPoints]
    
    if(points === 4 && currentTeamPts < opposingTeamPts) {
      this.activeTeamGoesAgain();
    } else {
      this.switchTurn();
    }

    const nextState = this.getState().transitions.PSYCHIC_PHASE;
    this.setState(nextState);
  }

  changeElo() {
    let winners;
    let losers;
    if (this.redPoints > this.bluePoints){
      winners = this.redTeam;
      losers = this.blueTeam;
      this.winner = 'Red Team'
    } else {
      winners = this.blueTeam;
      losers = this.redTeam;
      this.winner = 'Blue Team'
    }

    const eloForWinners = losers.length * 5;
    const eloWon = eloForWinners / winners.length;

    const players  = this.blueTeam.concat(this.redTeam);
    players.forEach((player) => {
      User.findById(player._id)
        .then(user => {
          const originalElo = user.eloRating.frequency;

          if(winners.some(winner => mongoose.Types.ObjectId(winner._id).equals(user._id))){
            const increasedElo = originalElo + eloWon;
            player.endingElo = increasedElo;
            user.set({ eloRating: { frequency: increasedElo }})
          } else {
            const decreasedElo = originalElo - 5;
            player.endingElo = decreasedElo;
            user.set({ eloRating: { frequency: decreasedElo }})

          }

          user.save();
        })
    })
  }

};

module.exports = FrequencyGame;