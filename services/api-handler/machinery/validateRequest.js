const {
  invalidRequest,
  invalidRedirectUrl,
  invalidRefreshToken,
  invalidAuthorizationToken,
  invalidScope
} = require('./OAuthResponses')

const { verifyRefreshToken, verifyAuthorizationToken } = require('./jwt')

const scopeParser = require('./scopeParser')

module.exports = {
  validateAuthorizeGetDisplayErrors,
  validateAuthorize,
  validateAccess,
  validateCodeGrant,
  validateRefreshTokenGrant,
  validateAuthorizeGet,
}


function validateAuthorizeGetDisplayErrors({ client_id, redirect_url }, clientConfig) {
  if (isUndefined(client_id)) return invalidRequest('client_id parameter missing')
  if (isUndefined(redirect_url)) return invalidRequest('redirect_url parameter missing')

  return validateRules([
    hasValidRedirectUrl(redirect_url, clientConfig)
  ])
}

function validateAuthorizeGet({ scope }, clientConfig) {
  if (isUndefined(scope)) return invalidRequest('client_id parameter missing')

  return validateRules([hasAllowedScope(scope, clientConfig)])
}

function validateAuthorize({ redirect_url, scope }, clientConfig)  {
  if (isUndefined(redirect_url)) return invalidRequest('redirect_url parameter missing')
  if (isUndefined(scope)) return invalidRequest('scope parameter missing')

  return validateRules([
    hasValidRedirectUrl(redirect_url, clientConfig),
    hasAllowedScope(scope, clientConfig)
  ])
}

function validateAccess({ grant_type, client_id, scope }) {
  if (isUndefined(grant_type)) return invalidRequest('grant_type parameter missing')
  if (isUndefined(client_id)) return invalidRequest('client_id parameter missing')

  return validateRules([])
}

function validateCodeGrant({ code, redirect_url }, clientConfig )  {
  if (isUndefined(redirect_url)) return invalidRequest('redirect_url parameter missing')
  if (isUndefined(code)) return invalidRequest('code parameter missing')

  return validateRules([
    hasValidRedirectUrl(redirect_url, clientConfig),
    hasValidAuthorizationCode(code, clientConfig)
  ])
}

function validateRefreshTokenGrant({ redirect_url, refresh_token  }, clientConfig)  {
  if (isUndefined(redirect_url)) return invalidRequest('redirect_url parameter missing')
  if (isUndefined(refresh_token)) return invalidRequest('refresh_token parameter missing')

  return validateRules([
    hasValidRedirectUrl(redirect_url, clientConfig),
    hasValidRefreshToken(refresh_token, clientConfig)
  ])
}

function hasValidRefreshToken(token, { refreshCodeSecret }) {
  return verifyRefreshToken(token, refreshCodeSecret)
    ? null
    : invalidRefreshToken()
}

function hasAllowedScope(scope, { scope: allowedScope }) {
  return scopeParser.parse(scope)
    .every(rule => scopeParser.parse(allowedScope).includes(rule))
    ? null
    : invalidScope()
}

function hasValidAuthorizationCode(token, authorizeTokenSecret)  {
  return verifyAuthorizationToken(token, authorizeTokenSecret)
    ? null
    : invalidAuthorizationToken()
}

function hasValidRedirectUrl(redirectUrl, clientConfig)  {
  return (clientConfig.redirectUrl === redirectUrl)
    ? null
    : invalidRedirectUrl()
}

function validateRules(errors) {
  return hasError(errors)
    ? findFirst(errors)
    : null
}

function findFirst(errors) {
  return errors.find(error => error !== null)
}

function hasError(errors ) {
  return findFirst(errors) !== undefined
}

function isUndefined(value) {
  return value === undefined
}
