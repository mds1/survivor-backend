'use strict'
// When using Claudia, app.js is no long valid when run locally due to changes
// made for AWS deployment. This file creates a local version that we can run
// locally using "node app.local.js"

// This version works when using "app" within app.js, but currently we are using
// "api" so this file currently does not work

const app = require('./app')
const port = process.env.PORT || 3000
app.listen(port, () =>
  console.log(`Server is listening on port ${port}.`)
)