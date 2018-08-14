module.exports = {

  extractWinningTeams: function (result) {
    // result -- returned object from MySportsFeed API v2.0 weekly URL

    // Define array to hold winners
    let winners = []

    // Extract winners
    if (result.status == 200) {
      const games = result.data.games;

      // Loop through each game
      for (let i = 0; i < games.length; i++) {
        game = games[i]

        // Make sure game is completed
        if (game.schedule.playedStatus.toLowerCase() != "COMPLETED".toLowerCase()) {
          // throw error if game was not completed
          throw "All games for this week must be completed to call this method"
        }

        // Get the two teams that played
        const homeTeam = game.schedule.homeTeam.abbreviation
        const awayTeam = game.schedule.awayTeam.abbreviation

        // Determine who won and add them to the winners array
        const homeScore = game.score.homeScoreTotal
        const awayScore = game.score.awayScoreTotal
        homeScore > awayScore ? winners.push(homeTeam) : winners.push(awayTeam)
      }
    }

    return winners
  }, // end extractWinningTeams


  getWinningIntegers: function (winners) {
    // winners -- returned array from extractWinnngTeams, should be an array of
    //            2 or 3 letter strings representing the teams

    // Define array to hold winning integers
    let winningIntegers = [];

    // Get mapping from teams to integers
    teamMapping = this.getTeams();

    // Loop through winners and convert string to corresponding integer
    for (let i = 0; i < winners.length; i++) {
      const team = winners[i]
      const int = teamMapping[team]
      winningIntegers.push(int)
    }

    // Return the integers
    return winningIntegers
  },


  getTeams: function () {
    // Return mapping of teams to their integers
    return {
      'ARI': 1,
      'ATL': 2,
      'BAL': 3,
      'BUF': 4,
      'CAR': 5,
      'CHI': 6,
      'CIN': 7,
      'CLE': 8,
      'DAL': 9,
      'DEN': 10,
      'DET': 11,
      'GB': 12,
      'HOU': 13,
      'IND': 14,
      'JAX': 15,
      'KC': 16,
      'LAC': 17, // LA chargers
      'LA': 18,  // LA rams (not LAR, since MySportsFeed uses LA)
      'MIA': 19,
      'MIN': 20,
      'NE': 21,
      'NO': 22,
      'NYG': 23,
      'NYJ': 24,
      'OAK': 25,
      'PHI': 26,
      'PIT': 27,
      'SEA': 28,
      'SF': 29,
      'TB':  30,
      'TEN': 31,
      'WAS': 32,
    }
  } // end getTeams
}
