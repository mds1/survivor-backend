/* eslint-disable-next-line */
'use strict'

const moment = require('moment');

moment().format();

module.exports = {

  extractWinningTeams(result) {
    // result -- returned object from MySportsFeed API v2.0 weekly URL

    // Define array to hold winners
    const winners = [];

    // Extract winners
    if (result.status === 200) {
      // Get list of games from API call
      const games = result.data.games;

      // Loop through each game
      for (let i = 0; i < games.length; i++) {
        const game = games[i];

        // Make sure game is completed
        if (game.schedule.playedStatus.toLowerCase() !== 'COMPLETED'.toLowerCase()) {
          // let us know if all games are not completed, and do not return the winners
          // TODO: this currently cannot handle postponed games
          return 'All games for this week must be completed to call this method';
        }

        // Get the two teams that played`
        const homeTeam = game.schedule.homeTeam.abbreviation;
        const awayTeam = game.schedule.awayTeam.abbreviation;

        // Determine who won and add them to the winners array
        const homeScore = game.score.homeScoreTotal;
        const awayScore = game.score.awayScoreTotal;
        /* eslint-disable-next-line no-unused-expressions */
        if (homeScore > awayScore) {
          winners.push(homeTeam);
        } else {
          winners.push(awayTeam);
        } // end if
      } // end for each game
    } // end if status === 200

    return winners;
  }, // end extractWinningTeams


  getWinningIntegers(winners) {
    // winners -- returned array from extractWinnngTeams, should be an array of
    //            2 or 3 letter strings representing the teams

    // Define array to hold winning integers
    const winningIntegers = [];

    // Get mapping from teams to integers
    const teamMapping = this.getTeams();

    // Loop through winners and convert string to corresponding integer
    for (let i = 0; i < winners.length; i++) {
      const team = winners[i];
      const int = teamMapping[team];
      winningIntegers.push(int);
    }

    // Return the integers
    return winningIntegers;
  },


  getTeams() {
    // Return mapping of teams to their integers
    return {
      ARI: 1,
      ATL: 2,
      BAL: 3,
      BUF: 4,
      CAR: 5,
      CHI: 6,
      CIN: 7,
      CLE: 8,
      DAL: 9,
      DEN: 10,
      DET: 11,
      GB: 12,
      HOU: 13,
      IND: 14,
      JAX: 15,
      KC: 16,
      LAC: 17, // LA chargers
      LA: 18, // LA rams (not LAR, since MySportsFeed uses LA)
      MIA: 19,
      MIN: 20,
      NE: 21,
      NO: 22,
      NYG: 23,
      NYJ: 24,
      OAK: 25,
      PHI: 26,
      PIT: 27,
      SEA: 28,
      SF: 29,
      TB: 30,
      TEN: 31,
      WAS: 32,
    };
  }, // end getTeams


  getCurrentWeek() {
    // Get current date
    const currentDate = moment();

    // Define date when week 2 games start (2018-09-06, 8:00 PM EST)
    // Therefore, any time before this date is week 1
    const week1GameStart = moment.unix(1536278400);
    const week2GameStart = week1GameStart.add(1, 'weeks');

    // Loop through and determine the week (i+1 gives current week)
    for (let i = 0; i < 17; i++) {
      const thisWeeksGamesStartDate = week2GameStart.add(i, 'weeks');
      if (currentDate < thisWeeksGamesStartDate) {
        // If this week's games have ended, return that week number
        return i + 1;
      }
    } // end for each week

    return new Error('Something went wrong in the getCurrentWeek function');
  },
};
