// WORK IN PROGRESS

// Import web3
import web3 from './web3';

// The file below will be output after compiling
import survivor from './Survivor.json';

// Create instance of contract to have access to functions
const instance = new web3.eth.Contract(
  survivor.abi,
  // *REPLACE* this address with the address of deployed contract
  '0x0000000000000000000000000000000000000000',
);

// Functions to get and manipulate contract data
module.exports = {

  getPlayers() {
  }, // end getPlayers

  getPlayersPicks() {
  }, // end getPlayersPicks

};
