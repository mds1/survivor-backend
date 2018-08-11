Designed for the ConsenSys Academy 2018 Developer Program Final Project. The frontend code can be found [here](https://github.com/mds1/survivor-frontend)

# NFL Survivor Dapp
This is the server side of an NFL Survivor dapp. This code is deployed on [AWS Lambda](https://aws.amazon.com/lambda/) to act as an API for obtaining weekly game results. The server fits into the dapp architecture as follows:
1. `Survivor.sol` uses [Oraclize](http://www.oraclize.it/) to reach out to this API
2. The API performs the following steps:
    1. Reach out to MySportsFeed's API to get a list of NFL winners from that week
    2. Query `Survivor.sol` for a list of remaining players and their picks for the week
    3. Determine which players are still alive
    4. Send a list of the surving players back to the contract
3. The API returns a list of players who are still alive

## Acknowledgements
* [Claudia](https://claudiajs.com/) made it super simple to create an API and deploy it to AWS. I've never done that prior to this project and Claudia made that process much more approachable
* Big thanks to the [MySportsFeed](https://www.mysportsfeeds.com/) team for providing a free/inexpensive API to obtain sports data
