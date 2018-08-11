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
    return winningIntegers
  },


  getTeams: function () {
    return {
      'ARI': 0,
      'ATL': 1,
      'BAL': 2,
      'BUF': 3,
      'CAR': 4,
      'CHI': 5,
      'CIN': 6,
      'CLE': 7,
      'DAL': 8,
      'DEN': 9,
      'DET': 10,
      'GB': 11,
      'HOU': 12,
      'IND': 13,
      'JAX': 14,
      'KC': 15,
      'LAC': 16, // LA chargers
      'LA': 17, // LA rams (not LAR, since MySportsFeed uses LA)
      'MIA': 18,
      'MIN': 19,
      'NE': 20,
      'NO': 21,
      'NYG': 22,
      'NYJ': 23,
      'OAK': 24,
      'PHI': 25,
      'PIT': 26,
      'SEA': 27,
      'SF': 28,
      'TB':  29,
      'TEN': 30,
      'WAS': 31,
    }
  } // end getTeams
}
