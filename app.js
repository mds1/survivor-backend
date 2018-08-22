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
