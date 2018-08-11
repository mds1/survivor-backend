// Tutorials used for deployment
//   - For normal serverless deployment:
//     https://medium.freecodecamp.org/express-js-and-aws-lambda-a-serverless-love-story-7c77ba0eaa35
//   - For API deployment
//     https://claudiajs.com/tutorials/hello-world-api-gateway.html

'use strict'

// Get required packages
const express = require('express')
const app = express()
const btoa = require('btoa');
const axios = require('axios');
const ApiBuilder = require('claudia-api-builder'),
api = new ApiBuilder();

// Import helper functions
const f = require('./utils/APIfunctions');

// Define routes
api.get('/api/getresults', async (req, res) => {
  // req -- object containing all info about the request made
  // res -- object with all information about what we'll respond with

  // Define some API variables
  const week = 10
  const year = 2017
  const query = `https://api.mysportsfeeds.com/v2.0/pull/nfl/${year}-regular/week/${week}/games.json`

  // Call API
  const apikey = process.env.MYSPORTSFEED_API_KEY;
  const result = await axios.get(query, {
    dataType: 'json',
    async: false,
    headers: {
      "Authorization": "Basic " + btoa(apikey + ":" + 'MYSPORTSFEEDS')
    },
  });

  // Extract winning teams from response
  const winners = f.extractWinningTeams(result);

  // Convert winning teams to their corresponding integers
  const winningIntegers = f.getWinningIntegers(winners);

  // res.send(winners)
  return { "winners": winners }

})

/* commenting out for AWS deployment
app.get('*', function (req, res) {
  res.send("Oops! This page doesn't exist :(")
})


// listen for requests
app.listen(PORT, function () {
  console.log(`Server has started on port ${PORT}`)
})
*/

module.exports = api