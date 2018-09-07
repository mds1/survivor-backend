NFL Survivor Decentralized Application, backend. The frontend code can be found [here](https://github.com/mds1/survivor-frontend)

# NFL Survivor Dapp
## API Overview
This is the server side of an NFL Survivor dapp. This code is deployed on Heroku to act as an API for obtaining weekly game results. The server fits into the dapp architecture as follows:
1. `Survivor.sol` uses [Oraclize](http://www.oraclize.it/) to reach out to this API
2. The API performs the following steps:
    1. Reach out to MySportsFeed's API to get a list of NFL winners from that week
    2. Query `Survivor.sol` for a list of remaining players and their picks for the week
    3. Determine which players are still alive
    4. Send a list of the surving players back to the contract
3. The API returns a list of players who are still alive

See the frontend code for more information about the application and its architecture.

## Sample Response
Sample API response (teams/integers are sorted by the order returned from the MySportsFeed API):

```json
{
    "status": 200,
    "players": [
        "0xd4506245b4B017ECaFa30471d020Fee7970112ab",
        "0x60b85c9A7b2947D884737A1b00b9ec9810D26663"
    ],
    "picks": [
        23,
        21
    ],
    "season": 2018,
    "week": 1,
    "winningTeams": [
        "SEA",
        "TEN",
        "MIN",
        "TB",
        "NO",
        "JAX",
        "PIT",
        "DET",
        "GB",
        "LA",
        "ATL",
        "SF",
        "NE",
        "CAR"
    ],
    "winningIntegers": [
        28,
        31,
        20,
        30,
        22,
        15,
        27,
        11,
        12,
        18,
        2,
        29,
        21,
        5
    ],
    "remainingPlayers": [
        "0x60b85c9A7b2947D884737A1b00b9ec9810D26663"
    ]
}
```

## Acknowledgements
* [Claudia](https://claudiajs.com/) made it super simple to create an API and deploy it to AWS. I've never done that prior to this project and Claudia made that process much more approachable
* Due to some issues with Scrypt/Web3 on AWS, I switched over to Heroku. So thanks to Heroku for also making deployment of a Node.js app straightforward
* Big thanks to the [MySportsFeed](https://www.mysportsfeeds.com/) team for providing a free/inexpensive API to obtain sports data
