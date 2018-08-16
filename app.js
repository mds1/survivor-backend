// Tutorials used for deployment
//   - For normal serverless deployment:
//     https://medium.freecodecamp.org/express-js-and-aws-lambda-a-serverless-love-story-7c77ba0eaa35
//   - For API deployment
//     https://claudiajs.com/tutorials/hello-world-api-gateway.html

// Get required packages
const btoa = require('btoa');
const axios = require('axios');
const ApiBuilder = require('claudia-api-builder');

const api = new ApiBuilder();

// Import helper functions
const f = require('./utils/APIfunctions');

// Define routes
api.get('/api/getresults', async (req, res) => {
  // req -- object containing all info about the request made
  // res -- object with all information about what we'll respond with

  // Define some API variables (TODO: update these to be dynamic)
  const week = 10;
  const year = 2017;
  const query = `https://api.mysportsfeeds.com/v2.0/pull/nfl/${year}-regular/week/${week}/games.json`;

  // Get MySportsFeed API key from the query
  const apikey = req.queryString.apikey;

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
  const winners = f.extractWinningTeams(result);

  // Convert winning teams to their corresponding integers
  const winningIntegers = f.getWinningIntegers(winners);

  // Send response
  return { winners };
});

module.exports = api;
