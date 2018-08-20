'use strict'

// Tutorials used for deployment
//   - For normal serverless deployment:
//     https://medium.freecodecamp.org/express-js-and-aws-lambda-a-serverless-love-story-7c77ba0eaa35
//   - For API deployment
//     https://claudiajs.com/tutorials/hello-world-api-gateway.html

// Get required packages
const express = require('express')
const btoa = require('btoa');
const axios = require('axios');
// const ApiBuilder = require('claudia-api-builder');

const app =  express()
// const api = new ApiBuilder();

// Import helper functions
const apifuncs = require('./utils/APIfunctions');
const contractfuncs = require('./utils/contractfunctions');

// Define routes
app.get('/', (req, res) => {
  // res.json({"message": "Nothing here :("})
  res.send({ "message": process.env.infuraAPIKey })
});

app.get('/api/getresults', async (req, res) => {
  // req -- object containing all info about the request made
  // res -- object with all information about what we'll respond with

  // Define some API variables (TODO: update these to be dynamic)
  const week = 10;
  const year = 2017;
  const query = `https://api.mysportsfeeds.com/v2.0/pull/nfl/${year}-regular/week/${week}/games.json`;

  const players = await contractfuncs.getPlayers();
  // const players = 'sdfasdfasdfsafd'

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
  const winners = apifuncs.extractWinningTeams(result);

  // Convert winning teams to their corresponding integers
  const winningIntegers = apifuncs.getWinningIntegers(winners);

  // Send response
  res.send({
    "winners": winners,
    "players": players
  })
});

module.exports = app;
