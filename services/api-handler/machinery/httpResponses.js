const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  notFound,
  badRequest,
  unauthorized,
  unprocessableEntity,
  internalServerError,
  redirect,
}

function notFound(message) { return { status: 404, data: { body: { message } } } }
function badRequest(message) { return { status: 400, data: { body: { message } } } }
function unauthorized(message) { return { status: 401, data: { body: { message } } } }
function unprocessableEntity(data) { return { status: 422, data: { body: data } } }
function internalServerError(e) {
  return {
    status: 500,
    data: { body: { message: isProduction ? 'Internal server error' : `${e}` } }
  }
}
function redirect(status, to) { return { status, headers: { 'Location': to } } }
