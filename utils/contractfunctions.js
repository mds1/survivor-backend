// WORK IN PROGRESS

// Import web3
const web3 = require('./web3').web3;

// The file below will be output after compiling
// const Survivor = require('../contracts/Survivor.json');

// Create instance of contract to have access to functions
/* eslint-disable-next-line */
// const survivor = new web3.eth.Contract(
//   Survivor.abi,
//   // *REPLACE* this address with the address of deployed contract
//   '0xf3020cb3070340becc8ca51d7ef33f7930d9edf3',
// );

// Functions to get and manipulate contract data
module.exports = {

  async getPlayers() {
    // get list of players
    // const players = await survivor.methods.getEnteredPlayers().call();
    const players = await web3.eth.getBalance('0x6d29803c2AcDdC6b9B1FF44B2226FFD70817d276');
    return players;
  }, // end getPlayers

  getPlayersPicks() {
    return 'b';
  }, // end getPlayersPicks

};
