/* eslint-disable-next-line */
'use strict'

// Tutorials used for deployment
//   - For normal serverless deployment:
//     https://medium.freecodecamp.org/express-js-and-aws-lambda-a-serverless-love-story-7c77ba0eaa35
//   - For API deployment
//     https://claudiajs.com/tutorials/hello-world-api-gateway.html

// Define port
const port = process.env.PORT || 3000;

// Get required packages
const express = require('express');
const btoa = require('btoa');
const axios = require('axios');
// const ApiBuilder = require('claudia-api-builder');

const app = express();
// const api = new ApiBuilder();

// Import helper functions
const apifuncs = require('./utils/APIfunctions');
const contractfuncs = require('./utils/contractfunctions');

// Define routes
app.get('/', (req, res) => {
  // res.json({"message": "Nothing here :("})
  res.send({ message: 'Nothing here :(' });
});

app.get('/api/getresults', async (req, res) => {
  // req -- object containing all info about the request made
  // res -- object with all information about what we'll respond with

  // Define some API variables (TODO: update these to be dynamic)
  const week = 10;
  const year = 2017;
  const query = `https://api.mysportsfeeds.com/v2.0/pull/nfl/${year}-regular/week/${week}/games.json`;

  // Get MySportsFeed API key from the query
  // const apikey = req.queryString.apikey; // use this with Claudia API builder
  const apikey = req.query.apikey; // use this with Express

  // Call API
  const key = btoa(`${apikey}:MYSPORTSFEEDS`);
  const result = await axios.get(query, {
    dataType: 'json',
    async: false,
    headers: {
      Authorization: `Basic ${key}`,
    },
  });

  // Extract winning teams from response
  const winningTeams = apifuncs.extractWinningTeams(result);

  // Convert winning teams to their corresponding integers
  const winningIntegers = apifuncs.getWinningIntegers(winningTeams);

  // Get winning players for this week
  const players = await contractfuncs.getPlayers();
  let picks = await contractfuncs.getPicks(players);
  picks = picks.map(x => parseInt(x, 10));
  const winningPlayers = contractfuncs.getWinningPlayers(players, picks, winningIntegers);

  // Send response
  res.json({
    status: 200,
    players,
    picks,
    winningTeams,
    winningIntegers,
    remainingPlayers: winningPlayers, // the new set of remaining players
  });
});

app.listen(port, () =>
  console.log(`Server is listening on port ${port}.`));
