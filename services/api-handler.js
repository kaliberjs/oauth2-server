const config = require('@kaliber/config')

const {
  badRequest,
  methodNotAllowed,
  unauthorized,
  accessTokenResponse,
  notFound,
  invalidGrant,
  invalidRequest,
  invalidClient
} = require('./api-handler/machinery/httpResponses')

const {
  makeAuthorizationToken,
  makeAccessToken,
  makeRefreshToken,
  makeAuthenticationToken,
} = require('./api-handler/machinery/jwt')

const {
  validateRefreshTokenGrant,
  validateAuthorize,
  validateCodeGrant,
  validateAccess
} = require('./api-handler/machinery/validateRequest')

module.exports = handleApiRequest

async function handleApiRequest(location, req) {
  if (req.method === 'GET') return handleGet(location)
  if (req.method === 'POST') return handlePost(location, req)

  return methodNotAllowed()
}

async function handleGet(location, req) {
  if (location.pathname === '/authorize')
    return handleAuthorize(req)

  return { status: 200, headers: null, data: null }
}

async function handlePost(location, req) {
  if (location.pathname === '/api/authenticate')
    return handleAuthenticate(req, { getAuthenticationTokenPayload })

  if (location.pathname === '/api/authorize')
    return handleAcceptAuthorization(req)

  if (location.pathname === '/api/access')
    return handleAccess(req)

  return notFound('resource not found')
}

async function handleAuthenticate(req, { getAuthenticationTokenPayload }) {
  if (!req.body) return badRequest('No body provided')

  const payload = await getAuthenticationTokenPayload(req.body)
  if (!payload) return unauthorized('Invalid credentials')

  const authToken = makeAuthenticationToken( payload, config.server.authenticationToken )

  return {
    status: 200,
    data: { body: payload },
    headers: {
      // TODO: cookie.serialize(...)
      // TODO: add authenticationTokenTtl as expiration
      'Set-Cookie': `session=${authToken}; Path=/ Secure; HttpOnly`,
    }
  }
}

async function handleAcceptAuthorization(req) {
  const {
    client_id,
    redirect_url,
    state
  } = req.query

  const clientConfig = findApp(client_id)

  // When we can not find a app in the configuration it means there is something
  // wrong with the client_it
  if (!clientConfig) {
    return invalidRequest('client_id parameter missing')
  }

  const errorRes = validateAuthorize(req.query, clientConfig)
  if (errorRes !== null) return validationErrorToExpressResponse(errorRes)

  const accessToken = makeAuthorizationToken({
    user: req.body.username,
    id: req.body.id
  }, clientConfig)

  return {
    status: 200,
    data: {
      body: {
        redirectUrl: `${redirect_url}?code=${accessToken}&state=${state}`
      }
    },
    headers: {
      'Set-Cookie': `accessToken=${accessToken}; Path=/`,
    }
  }
}

async function handleAccess(req) {
  const errorRes = validateAccess(req.body)
  if (errorRes !== null) return validationErrorToExpressResponse(errorRes)

  // When we can not find a app in the configuration it means there is something
  // wrong with the client_it
  if (!findApp(req.body.client_id)) {
    return invalidClient()
  }

  if (req.body.grant_type === 'authorization_code') return handleCodeGrant(req)
  if (req.body.grant_type === 'refresh_token') return handleRefreshTokenGrant(req)

  return invalidGrant()
}

async function handleCodeGrant(req) {
  const { client_id } = req.body
  const clientConfig = findApp(client_id)

  const errorRes = validateCodeGrant(req.body, clientConfig)
  if (errorRes !== null) return validationErrorToExpressResponse(errorRes)

  const refresh_token = makeRefreshToken({
    content: 'we think about this later'
  }, clientConfig)

  const accessToken = makeAccessToken({
    expiresIn: 3600,
    scope: 'any'
  }, clientConfig)

  return accessTokenResponse({
    refresh_token,
    access_token: accessToken,
    token_type: 'bearer',
    expiresIn: 3600,
    scope: 'any'
  })
}

async function handleRefreshTokenGrant(req) {
  const { client_id } = req.body
  const clientConfig = findApp(client_id)

  const errorRes = validateRefreshTokenGrant(req.body, clientConfig)
  if (errorRes !== null) return validationErrorToExpressResponse(errorRes)

  const accessToken = makeAccessToken({
    expiresIn: 3600,
    scope: 'any'
  }, client_id)

  return accessTokenResponse({
    access_token: accessToken,
    token_type: 'bearer',
    expiresIn: 3600,
    scope: 'any'
  })
}

function validationErrorToExpressResponse({ status, error, error_description }) {
  return {
    status: 400,
    data: {
      body: {
        error,
        ...(error_description !== undefined
          ? { error_description }
          : {})
      }
    }
  }
}

function findApp(clientId) {
  return config.apps.find(app => app.clientId === clientId)
}

async function getAuthenticationTokenPayload(body) {
  const { username, password } = body
  if (username === 'valid-user' && password === 'valid-password') {
    return {
      user: 'rick',
      id: 3
    }
  }
}
