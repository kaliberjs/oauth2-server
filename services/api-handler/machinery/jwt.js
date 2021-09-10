const jwt = require('jsonwebtoken')

module.exports = {
  makeAuthorizationToken,
  makeAccessToken,
  makeRefreshToken,
  makeAuthenticationToken,
  verifyAuthorizationToken,
  verifyAccessToken,
  verifyRefreshToken,
  verifyAuthenticationToken
}

function makeAuthenticationToken(content, { authenticationTokenSecret, authenticationTokenTtl }) {
  return jwt.sign(
    content,
    authenticationTokenSecret,
    {
      expiresIn: authenticationTokenTtl
    })
}

function makeAuthorizationToken(content, { authorizeTokenSecret, authorizeTokenTtl }) {
  return jwt.sign(content, authorizeTokenSecret, {
    expiresIn: authorizeTokenTtl
  })
}

function makeRefreshToken(content, { refreshTokenSecret, refreshTokenTtl }) {
  return jwt.sign(
    content,
    refreshTokenSecret,
    {
      expiresIn: refreshTokenTtl
    })
}

function makeAccessToken(content, { accessTokenSecret, accessTokenTtl }) {
  return jwt.sign(
    content,
    accessTokenSecret,
    {
      expiresIn: accessTokenTtl,
      algorithm: 'RS256'
    })
}

function verifyAuthenticationToken(token, { authenticationTokenSecret }) {
  return jwt.verify(token, authenticationTokenSecret, {
    algorithms: ['HS256']
  })
}
function verifyAuthorizationToken(token, { authorizeTokenSecret }) {

  return jwt.verify(token, authorizeTokenSecret, {
    algorithms: ['HS256']
  })
}

function verifyAccessToken(token, { accessTokenSecret }) {
  return jwt.verify(token, accessTokenSecret, {
    algorithms: ['RS256']
  })
}

function verifyRefreshToken(token, { refreshTokenSecret }) {
  return jwt.verify(token, refreshTokenSecret, {
    algorithms: ['HS256']
  })
}
