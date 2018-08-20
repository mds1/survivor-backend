// WORK IN PROGRESS

// Import web3
const web3 = require('./web3').web3;

// The file below will be output after compiling
const Survivor = require('../contracts/Survivor.json');

// Create instance of contract to have access to functions
/* eslint-disable-next-line */
const survivor = new web3.eth.Contract(
  Survivor.abi,
  // *REPLACE* this address with the address of deployed contract
  '0x66acd4550da9658a77c94ab6b255488588ad8dce',
);

// Functions to get and manipulate contract data
module.exports = {

  async getPlayers() {
    // get list of players
    const players = await survivor.methods.getRemainingPlayers().call();
    // const players = await web3.eth.getBalance('0x6d29803c2AcDdC6b9B1FF44B2226FFD70817d276');
    return players;
  }, // end getPlayers


  async getPicks(players) {
    // players -- array of players who are remaining

    // define array to hold all promises
    const promises = [];

    // loop through players
    for (let i = 0; i < players.length; i++) {
      // create promise to get their pick
      const player = players[i];
      const promise = survivor.methods.getPlayersPick(player).call();
      promises.push(promise);
    }

    // resolve all promises
    const picks = Promise.all(promises);
    return picks;
  }, // end getPlayersPicks


  getWinningPlayers(players, picks, winningIntegers) {
    // players -- array of players who are remaining
    // picks -- array of picks for each player in players
    // winningIntegers -- array of teams that won this week

    // define array to hold all winning players' addresses
    const winners = [];

    // loop through players
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      const pick = picks[i];
      // mark player as weekly winner if they picked correctly
      if (winningIntegers.includes(pick)) {
        winners.push(player);
      }
    } // end for each player

    return winners;
  },

};
