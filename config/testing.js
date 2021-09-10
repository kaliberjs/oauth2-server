const { readFileSync } = require('fs')

module.exports = {

  authenticationTokenSecret: 'secret',
  authenticationTokenTtl: '2 days',

  apps: [{
    clientId: 'valid-client',
    redirectUrl: 'valid-test-url',
    scope: 'valid scope',
    authorizeTokenSecret: 'secret',
    authorizeTokenTtl: '2 days',
    accessTokenSecret: readFileSync('./config/private.pem'),
    accessTokenTtl: '1 hour',
    refreshTokenSecret: 'secret2',
    refreshTokenTtl: '2 days',
  }]
}
