const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  notFound,
  badRequest,
  methodNotAllowed,
  unauthorized,
  unprocessableEntity,
  internalServerError,
  redirect,
  accessTokenResponse,
  invalidRequest,
  invalidRedirectUrlGet,
  invalidClientGet,
  invalidRefreshToken,
  invalidClient,
  invalidGrant,
  invalidRedirectUrl
}

function notFound(message) { return { status: 404, data: { body: { message } } } }
function badRequest(message) { return { status: 400, data: { body: { message } } } }
function methodNotAllowed() { return { status: 405 } }
function unauthorized(message) { return { status: 401, data: { body: { message } } } }
function unprocessableEntity(data) { return { status: 422, data: { body: data } } }
function internalServerError(e) {
  return {
    status: 500,
    data: { body: { message: isProduction ? 'Internal server error' : `${e}` } }
  }
}
function redirect(status, to) { return { status, headers: { 'Location': to } } }


function accessTokenResponse(body) {
  return {
    status: 200,
    headers: {
      'Cache-Control': 'no-store',
      'Pragma': 'no-cache'
    },
    data: { body }
  }
}

function invalidRedirectUrlGet() { badRequest('invalid redirect_url') }
function invalidClientGet() { badRequest('invalid client_id') }

function invalidRequest(error_description) { return { status: 400, data: { body: { error: 'invalid_request', error_description } } } }
function invalidClient() { return { status: 400, data: { body: { error: 'invalid_client' } } } }
function invalidGrant() { return { status: 400, data: { body: { error: 'invalid_grant type' } } } }
function invalidScope() { return { status: 400, data: { body: { error: 'invalid_scope' } } } }

function unauthorizedClient() { return { status: 400, data: { body: { error: 'unauthorized_client' } } } }
function unsupportedGrantType() { return { status: 400, data: { body: { error: 'unsupported_grant_type' } } } }


function access_denied() { return { status: 400, data: { body: { error: 'access_denied' } } } }
function unsupported_response_type() { return { status: 400, data: { body: { error: 'unsupported_response_type' } } } }
function temporarily_unavailable() { return { status: 400, data: { body: { error: 'server_error' } } } }

// I made this one up, I could not find a response in the docs
function invalidRefreshToken() { return { status: 400, data: { body: { error: 'invalid_refresh_token' } } } }
function invalidRedirectUrl() { return { status: 400, data: { body: { error: 'invalid_redirect_url' } } } }

