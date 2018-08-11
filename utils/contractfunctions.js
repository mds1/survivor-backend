// Configure contract instance
// Import web3
import web3 from './web3'
// The file below will be output after compiling
import survivor from '@contracts/Survivor.json';
// Create instance of contract to have access to functions
const instance = new web3.eth.Contract(
  survivor.abi,
  // *REPLACE* this address with the address of your deployed contract
  '0x170732ddd535ca37245ac8e24677f87c9a232965',
);




module.exports = {

  getPlayers: function () {

  }, // end extractWinningTeams

}
