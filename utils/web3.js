/*
Create file called config.js like the sample below. This file should contain the
Infura API key, mnemonic phrase, and any other API keys needed

Note: mnemonic phrase for existing MetaMask account is in Settings -> Reveal Seed Words

BEGIN Sample config.js file:
--------------------------------------------------------------------------------
const keys = {
  INFURA_API_KEY: 'PasteYourKeyHere',
  mnemonic: 'Paste your seed phrase here',
}

module.exports = keys
--------------------------------------------------------------------------------
END Sample config.js file:
*/

import Web3 from 'web3';

// Import Infura key
const keys = require('../config');

const { INFURA_API_KEY } = keys;

// *REPLACE* -- make sure network matches the string in requiredNetwork() in functions.js
// TODO: replace this with an import of the requiredNetwork function
// Get network to use
const network = 'rinkeby';

// Code is running on the server *OR* the user is not running MetaMask
// set up our own provider to connect to network through Infura
const provider = new Web3.providers.HttpProvider(`https://${network}.infura.io/${INFURA_API_KEY}`);
const web3 = new Web3(provider);


// export the web3 instance
export default web3;
