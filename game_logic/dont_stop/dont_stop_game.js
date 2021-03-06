const dontStopState = require('./dont_stop_state');
const User = require('../../models/User');
const mongoose = require('mongoose');

class DontStopGame {
  constructor(data){
    this.name = "Dont Stop";
    this.teamGame = false;

    if(data){
      this.demoGame = data.demoGame;
      this.dice = data.dice;
      this.pairs = data.pairs
      this.players = data.players;
      this.routes = data.routes;
      this.currentRun = data.currentRun;
      this.turnCounter = data.turnCounter;
      this.turnOrder = data.turnOrder;
      
      

      this.board = data.board;
      this.winner = data.winner;
      this.currentPlayer = data.currentPlayer;
      this.currentState = data.currentState;
      this.gameOver = data.gameOver;
    }

    this.getState = this.getState.bind(this);
    this.removeNull = this.removeNull.bind(this);
  }

  async setupNewGame(players){
    this.demoGame = false;
    this.dice = [];
    this.pairs = {};
    this.players = [];
    this.routes = {};
    this.currentRun = {};
    this.turnCounter = 0;

    this.colors = ['red', 'green', 'blue', 'yellow'];
    this.shuffleColors();
    this.turnOrder = [];
    this.winner = "";

    players.forEach((player) => {
      const color = this.colors.pop()
      this.turnOrder.push(color);
      this.players.push({
        _id: player._id,
        color: color,
        bot: false
      })
    })

    this.shuffleTurnOrder()
    this.currentPlayer = this.turnOrder[this.turnCounter];
    this.setupBoard();
    this.setupRolls()
    this.gameOver = false;
    this.currentState = 2;
  }

  async setupDemoGame(players, bots){
    this.demoGame = true;
    this.dice = [];
    this.pairs = {};
    this.players = [];
    this.routes = {};
    this.currentRun = {};
    this.turnCounter = 0;

    this.colors = ['red', 'green', 'blue', 'yellow'];
    this.shuffleColors();
    this.turnOrder = [];
    this.winner = "";

    players.forEach((player) => {
      const color = this.colors.pop()
      this.turnOrder.push(color);
      this.players.push({
        _id: player._id,
        color: color,
        bot: false
      })
    })

    bots.forEach((bot) => {
      const color = this.colors.pop()
      this.turnOrder.push(color);
      this.players.push({
        _id: bot._id,
        color: color,
        bot: true
      })
    })

    this.currentPlayer = this.turnOrder[this.turnCounter];
    this.setupBoard();
    this.setupRolls()
    this.gameOver = false;
    this.currentState = 2;
  }

  setupBoard(){
    this.board = {
      2: { max: 3, start: 0, completed: false, color: null, players: {} },
      3: { max: 5, start: 0, completed: false, color: null, players: {} },
      4: { max: 7, start: 0, completed: false, color: null, players: {} },
      5: { max: 9, start: 0, completed: false, color: null, players: {} },
      6: { max: 11, start: 0, completed: false, color: null, players: {} },
      7: { max: 13, start: 0, completed: false, color: null, players: {} },
      8: { max: 11, start: 0, completed: false, color: null, players: {} },
      9: { max: 9, start: 0, completed: false, color: null, players: {} },
      10: { max: 7, start: 0, completed: false, color: null, players: {} },
      11: { max: 5, start: 0, completed: false, color: null, players: {} },
      12: { max: 3, start: 0, completed: false, color: null, players: {} },
    }
    const colors = this.players.map(player => player.color);
    for (let i = 2; i <= 12; i++){
      for(let j = 0; j < colors.length; j++){
        this.board[i].players[colors[j]] = 0;
      }
    }
  }

  setState(nextState) {
    this.currentState = nextState;
  }

  getState(){
    return dontStopState[this.currentState];
  }

  shuffleColors() {
    for (let i = this.colors.length - 1; i > 0; i--) {
      let randomIdx = Math.floor(Math.random() * i);
      [this.colors[i], this.colors[randomIdx]] = [this.colors[randomIdx], this.colors[i]];
    }
  }

  shuffleTurnOrder() {
    for (let i = this.turnOrder.length - 1; i > 0; i--) {
      let randomIdx = Math.floor(Math.random() * i);
      [this.turnOrder[i], this.turnOrder[randomIdx]] = [this.turnOrder[randomIdx], this.turnOrder[i]];
    }
  }

  setupRolls(){
    this.rollDice();
    this.generatePairs();
    const possibleRoutes = this.possibleRoutes()
    this.generateRoutes(possibleRoutes);
  }

  rollDice(){
    this.dice = [];
    for(let i = 0; i < 4; i++){
      this.dice.push(Math.floor(Math.random() * 6) + 1);
    }
  }

  generatePairs(){
    this.pairs[0] = [[this.dice[0], this.dice[1]], [this.dice[2], this.dice[3]]]
    this.pairs[1] = [[this.dice[1], this.dice[2]], [this.dice[3], this.dice[0]]]
    this.pairs[2] = [[this.dice[0], this.dice[2]], [this.dice[1], this.dice[3]]]
  }

  generateRoutes(possibleRoutes){
    for(let i = 0; i < 3; i++){
      this.routes[i] = []

      for(let j = 0; j < 2; j++){
        let sum = this.pairs[i][j].reduce((a,b) => a + b)
        if(possibleRoutes.includes(sum)){
          this.routes[i].push(sum);
        } else {
          this.routes[i].push(null);
        }
      }
    }

    const currentRoutes = Object.keys(this.currentRun).map(value => parseInt(value));

    for(let key in this.routes){
      if(currentRoutes.length === 2 && (this.routes[key].filter(value => currentRoutes.includes(value))).length === 0 
        && this.routes[key][0] !== this.routes[key][1]){
        this.routes[key] = [this.routes[key].slice(0,1), this.routes[key].slice(1)]
      }

      this.routes[key] = this.removeNull(this.routes[key]);
    }
  }

  possibleRoutes(){
    let possible = [];
    routeLoop:
    for(let i = 2; i <= 12; i++){
      if(this.board[i].completed){
        continue routeLoop;
      }

      for(let key in this.currentRun){
        let routeNum = parseInt(key)
        if(routeNum === i && this.currentRun[routeNum] >= this.board[routeNum].max){
          continue routeLoop
        }

        const paths = Object.keys(this.currentRun);
        if(paths.length === 3 && paths.every(val => parseInt(val) !== i)){
          continue routeLoop;
        }
      }
      
      possible.push(i);
    }
    return possible;
  }

  removeNull(array){
    return array.filter(val => val !== null)
          .map(val => Array.isArray(val) ? this.removeNull(val) : val);
  }

  climbImpossible(){
    return Object.values(this.routes).flat(2).every(val => val === null) 
  }

  isGameOver(){
    const completedRoutes = Object.values(this.board)
      .filter(route => route.color !== null)
      .reduce((sums, curr) => {
      sums[curr.color] = (sums[curr.color] || 0) + 1;
      return sums;
    }, {})


    for(let color in completedRoutes){
      if(completedRoutes[color] >= 3){
        this.winner = color;
        this.gameOver = true;
        return true
      }
    }

    return false;
  }

  currentPlayerIsBot(){
    return this.players.filter(p => p.color === this.currentPlayer)[0].bot;
  }

  botChooseRandomRoute(){
    for(let subArr of Object.values(this.routes)){
      if(Array.isArray(subArr[0])){
        if(subArr[0][0] !== null){
          return subArr[0]
        }
      } else if (subArr[0] !== null){
        return subArr;
      }
    }
  }

  botChooseClimbOrStop(){
    return Math.random() < 0.5 ? 'continue' : 'stopClimb'
  }

  handleEvent(action, args) {
    if (this.getState().type === 'automated') {
      return this[action](args);
    }

    if(this.getState().type === 'activePlayer'){
      // Check activePlayer
    }
    return this[action](args);
  }


  chooseDice(data){
    // comes in as an array of routes
    data.routes.forEach(route => {
      if(route === null){
        return
      }

      if(!this.currentRun[route]){
        this.currentRun[route] = this.board[route].players[this.currentPlayer] + 1;
      } else if (this.board[route].max > this.currentRun[route]) {
        this.currentRun[route] += 1
      }
    })

    const nextState = this.getState().transitions.CLIMB_PHASE;
    this.setState(nextState);
  }

  continue(){
    this.setupRolls()

    if(this.climbImpossible()){
      const nextState = this.getState().transitions.FAIL_CLIMB;
      this.setState(nextState);
    } else {
      const nextState = this.getState().transitions.DICE_REVEAL;
      this.setState(nextState);
    }
  }

  stopClimb(){
    for(let val in this.currentRun){
      let routeNum = parseInt(val)
      this.board[routeNum].players[this.currentPlayer] = this.currentRun[routeNum];

      if (this.board[routeNum].max <= this.currentRun[routeNum]){
        this.board[routeNum].completed = true;
        this.board[routeNum].color = this.currentPlayer;
      }
    }

    if(this.isGameOver()){

      this.changeElo();
      const nextState = this.getState().transitions.GAME_END;
      this.setState(nextState);
    } else {
      const nextState = this.getState().transitions.END_TURN;
      this.setState(nextState);
    }
  }

  changeElo() {
    const winner = this.players.filter(player => player.color === this.winner)
    const numPlayers = this.players.length - 1;
    const eloForWinner = numPlayers * 5;
    let eloWon = eloForWinner / numPlayers;
    this.players.forEach((player) => {
      User.findById(player._id)
      .then((user) => {
        let originalElo = user.eloRating.dontStop;

        if(mongoose.Types.ObjectId(winner[0]._id).equals(user._id)){
          const increasedElo = {eloRating: { dontStop: (originalElo + eloWon) }};
          user.set(increasedElo)
        } else {
          const deductedElo = {eloRating: { dontStop: (originalElo - 5) }};
          user.set(deductedElo)
        }
        user.save()
      })
      .catch(err => console.log(err));
    });
  }

  setupNewTurn(){
    this.dice = [];
    this.routes = {};
    this.pairs = {};
    this.turnCounter += 1
    this.currentRun = {}
    this.currentPlayer = this.turnOrder[this.turnCounter % this.turnOrder.length];

    this.setupRolls()

    if(this.climbImpossible()){
      const nextState = this.getState().transitions.FAIL_CLIMB;
      this.setState(nextState);
    } else {
      const nextState = this.getState().transitions.DICE_REVEAL;
      this.setState(nextState);
    }
  }
}

module.exports = DontStopGame;