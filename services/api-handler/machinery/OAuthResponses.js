module.exports = {
  invalidRequest,
  invalidRedirectUrl,
  invalidRefreshToken,
  invalidClient,
  invalidAuthorizationToken,
  invalidScope
}

function invalidRequest(error_description) {
  return {
    error: 'invalid_request',
    error_description
  }
}

function invalidRedirectUrl() {
  return {
    error: 'invalid_redirect_url'
  }
}

function invalidRefreshToken() {
  return {
    error: 'invalid_refresh_token'
  }
}
function invalidAuthorizationToken() {
  return {
    error: 'invalid_authorization_token'
  }
}

function invalidClient() {
  return {
    error: 'invalid_client'
  }
}

function invalidScope() {
  return {
    error: 'invalid_scope'
  }
}
