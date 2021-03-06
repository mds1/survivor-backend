/* eslint-disable-next-line */
'use strict'

/*
Create file called config.js like the sample below. This file should contain the
Infura API key, mnemonic phrase, and any other API keys needed

Note: mnemonic phrase for existing MetaMask account is in Settings -> Reveal Seed Words

BEGIN Sample config.js file:
--------------------------------------------------------------------------------
const keys = {
  infuraAPIKey: 'PasteYourKeyHere',
}

module.exports = keys
--------------------------------------------------------------------------------
END Sample config.js file:
*/

const Web3 = require('web3');

// Import keys
let infuraAPIKey;
if (typeof process.env.infuraAPIKey === 'undefined') {
  // Running locally, so read from config file (TODO: set env vars locally)
  /* eslint-disable-next-line global-require */
  infuraAPIKey = require('../config').infuraAPIKey;
} else {
  // Running on server, read from environment variable
  infuraAPIKey = process.env.infuraAPIKey;
}

// *REPLACE* -- make sure network is properly set
// Get network to use
const network = 'rinkeby';

// Code is running on the server *OR* the user is not running MetaMask
// set up our own provider to connect to network through Infura
const provider = new Web3.providers.HttpProvider(`https://${network}.infura.io/v3/${infuraAPIKey}`);
const web3 = new Web3(provider);


// export the web3 instance
module.exports = { web3 };
