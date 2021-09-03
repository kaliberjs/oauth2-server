const { badRequest, unauthorized } = require('./api-handler/machinery/httpResponses')
const { sign, verify } = require('./jwt')
const config = require('@kaliber/config')



module.exports = async function handleApiRequest(location, req) {

  if (req.method === 'POST') return handlePost(location, req)
  const status = 200
  const data = null
  const headers = null
  return { status, headers, data }
}

async function handlePost(location, req) {
  if (location.pathname === '/api/authenticate') return handleAuthenticate(req)
  if (location.pathname === '/api/authorize') return handleAuthorize(req)
  if (location.pathname === '/api/access') return handleAccess(req)
}

async function handleAuthenticate(req) {
  if (!req.body) return badRequest('No body provided')

  const { username, password } = req.body

  if (username === 'rick' && password === 'pass') {
    return { status: 200, data: { body: { username: 'rick', id: 3 } } }
  } else return unauthorized('Invalid credentials')
}

async function handleAuthorize(req) {

  const code = sign({ user: req.body.username, id: req.body.id }, config.apps[0].authorize_code_secret, {
    expiresIn: '2 days'
  })

  console.log(code)

  return { status: 200, data: { body: { code } } }
}

async function handleAccess(req) {
  try {
    verify(req.body.code, config.apps[0].authorize_code_secret )
  } catch (e) {
    return unauthorized('something wrong with the code')
  }

  const refresh_token = sign({ data: 'we think about later' }, config.apps[0].refresh_code_secret)

  const accessToken = sign({
    refresh_token,
    expiresIn: 3600,
    scope: 'any'
  }, 'asdas')

  return { status: 200, data: { body: {
    access_token: accessToken,
    token_type: 'bearer',
    expiresIn: 3600,
    refresh_token: 'IwOGYzYTlmM2YxOTQ5MGE3YmNmMDFkNTVk',
    scope: 'any'
  } } }
}

/*
grant_type=code
&code=Yzk5ZDczMzRlNDEwY
&redirect_uri=https://example-app.com/cb
&client_id=mRkZGFjM

->>

{
  "access_token":"MTQ0NjJkZmQ5OTM2NDE1ZTZjNGZmZjI3",
  "token_type":"bearer",
  "expires_in":3600,
  "refresh_token":"IwOGYzYTlmM2YxOTQ5MGE3YmNmMDFkNTVk",
  "scope":"create"
}
*/
