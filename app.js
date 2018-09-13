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
const moment = require('moment');

const app = express();
moment().format();

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

  // Define start of 2018 NFL season (2018-09-06, 8:00 PM EST)
  const startDate = moment.unix(1536278400); // seconds since Unix Epoch

  // Get current date
  const currentDate = moment();

  // Determine which API parameters to use
  let year; // NFL season year
  let week; // NFL season week
  if (currentDate > startDate) {
    // Season has started, get real data
    year = 2018;
    week = apifuncs.getCurrentWeek();
  } else {
    // Season has not started, use test data
    year = 2017;
    // week = Math.floor(Math.random() * 17) + 1; // generate random week 1-17
    week = 10; // use fixed week for now
  }

  // Define API query
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

  // Return if games are not yet completed
  if (typeof winningTeams === 'string') {
    return res.json({
      status: 403, // forbidden to call at this time
      msg: winningTeams, // contains message that games are not complete
      mySportsFeedsResult: result.data, // the MySportsFeeds API result
    });
  }

  // Convert winning teams to their corresponding integers
  const winningIntegers = apifuncs.getWinningIntegers(winningTeams);

  // Get current remaining players from contract
  const players = await contractfuncs.getPlayers();
  // Get the pick of each remaining player
  let picks = await contractfuncs.getPicks(players);
  // Convert their picks to integers
  picks = picks.map(x => parseInt(x, 10));
  // Determine new set of remaining players
  const winningPlayers = contractfuncs.getWinningPlayers(players, picks, winningIntegers);

  // Send response
  res.json({
    status: 200,
    players, // players who were alive
    picks, // each players pics
    season: year, // current NFL season
    week, // current NFL week
    winningTeams, // winning NFL teams this weak
    winningIntegers, // winning NFL teams this week, represented as integers
    remainingPlayers: winningPlayers, // the new set of remaining players
    mySportsFeedsResult: result.data, // the MySportsFeeds API result
  });
});

app.listen(port, () =>
  console.log(`Server is listening on port ${port}.`));
