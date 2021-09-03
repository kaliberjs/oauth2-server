const express = require('express')

module.exports = {
  /*
    Warning: do not use this to set values that differ in each environment,
    only use this for configuration that is the same across all config environments
  */
  rollbar: {
    post_client_item: 'get an access token at rollbar.com',
  },

  apps: [
    {
      name: 'test',
      client_id: '7165549821652',
    }
  ],

  server: {
    api: {
      handler: require('./api-handler'),
    },
  },

  kaliber: {
    serveMiddleware: [express.json(), express.urlencoded({ extended: true })]
  }
}
