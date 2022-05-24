const frequencyState = require('./frequency_state');
const Card = require('./models/card');
const mongoose = require('mongoose');
const db = require('../../config/keys').mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));


class FrequencyGame {
  constructor(data){
    this.name = "Frequency";
    if(data){
      this.deck = data.deck;
      this.currentCard = data.currentCard;
      this.discard = data.discard;
  
      this.activeTeam = data.activeTeam;
      this.redTeam = data.redTeam;
      this.blueTeam = data.blueTeam;
      this.redPsychic = 0;
      this.bluePsychic = 0;
      this.dial = data.dial;
      this.guess = data.guess;
      this.clue = data.clue;
      this.redPoints = data.redPoints;
      this.bluePoints = data.bluePoints;
      this.leftOrRight = data.leftOrRight;

      this.currentState = data.currentState;
      this.gameOver = data.gameOver;
    }

    this.getState = this.getState.bind(this);
  }

  async setupNewGame({redTeam, blueTeam}){
    this.name = "Frequency";
    this.discard = []
    this.redTeam = [];
    this.blueTeam = [];
    this.redPsychic = 0;
    this.bluePsychic = 0;
    this.redPoints = 0;
    this.bluePoints = 0;
    this.guess = null;
    this.clue = null;
    this.dial = null;
    this.leftOrRight = null;

    await Card.find()
    .then(data => this.deck = (data))
    .catch(reason => console.error(reason));

    redTeam.forEach((player) => {
      this.redTeam.push({
        _id: player._id,
        activePlayer: false,
        isPsychic: false
      })
    })

    blueTeam.forEach((player) => {
      this.blueTeam.push({
        _id: player._id,
        activePlayer: false,
        isPsychic: false
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

  selectRandomStartTeam(){
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
      if(!player.isPsychic){
        player.activePlayer = true
      }
    })
  }

  setActiveTeamFalse(team){
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
    return (this.redPoints >= 10 || this.bluePoints >= 10)
  }

  newTurnSetup(){
    this.discard.push(this.currentCard)
    this.currentCard = this.deck.pop();
    this.setRandomDial();
    this.clue = null;
    this.leftOrRight = null;
    this.guess = null;
  }

  switchTurn(){
    if(this.activeTeam.color === 'red'){
      this.setActiveTeamFalse(this.redTeam);
      this.bluePsychic += 1;
      let currentPsychic = this.blueTeam[this.bluePsychic % this.blueTeam.length]
      currentPsychic.isPsychic = true;
      currentPsychic.activePlayer = true;
    } else {
      this.setActiveTeamFalse(this.blueTeam);
      this.redPsychic += 1;
      let currentPsychic = this.redTeam[this.redPsychic % this.redTeam.length]
      currentPsychic.isPsychic = true;
      currentPsychic.activePlayer = true;
    }

    this.newTurnSetup()
  }

  activeTeamGoesAgain(){
    if(this.activeTeam.color === 'red'){
      this.setActiveTeamFalse(this.redTeam);
      this.redPsychic += 1;
      let currentPsychic = this.redTeam[this.redPsychic % this.redTeam.length]
      currentPsychic.isPsychic = true;
      currentPsychic.activePlayer = true;
    } else {
      this.setActiveTeamFalse(this.blueTeam);
      this.bluePsychic += 1;
      let currentPsychic = this.blueTeam[this.bluePsychic % this.blueTeam.length]
      currentPsychic.isPsychic = true;
      currentPsychic.activePlayer = true;
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
    this.dial = Math.floor(Math.random() * 181) - 90;
  }

  giveClue(data) {
    this.clue = data.clue;
    
    if(this.activeTeam === 'red'){
      this.redTeam[this.redPsychic].activePlayer = false;
      this.setActiveTeam(this.redTeam);
    } else {
      this.blueTeam[this.bluePsychic].activePlayer = false;
      this.setActiveTeam(this.blueTeam);
    }

    const nextState = this.getState().transitions.TEAM_PHASE;
    this.setState(nextState);
  }

  makeGuess(data){
    this.guess = data.guess;

    const nextState = this.getState().transitions.LEFT_RIGHT_PHASE;
    this.setState(nextState);
  }

  chooseLeftRight(data){
    this.leftOrRight = data.leftOrRight;

    const nextState = this.getState().transitions.SCORE_PHASE;
    this.setState(nextState);
  }

  scorePoints(data) {
    let points = this.checkGuess(this.guess);

    if(this.activeTeam === 'red'){
      this.redPoints += points;
      this.bluePoints += this.checkLeftOrRight();
    } else {
      this.bluePoints += points;
      this.bluePoints += this.checkLeftOrRight();
    }

    let [currentTeamPts, opposingTeamPts] = this.activeTeam === 'red' ? [this.redPoints, this.bluePoints] : [this.bluePoints, this.redPoints]

    if(this.isGameOver()){
      const nextState = this.getState().transitions.GAME_END;
      this.setState(nextState);
      return;
    } else if(points === 4 && currentTeamPts < opposingTeamPts) {
      this.activeTeamGoesAgain();
    } else {
      this.switchTurn();
    }
    
    const nextState = this.getState().transitions.PSYCHIC_PHASE;
    this.setState(nextState);
  }

};

module.exports = FrequencyGame;