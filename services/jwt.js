const jwt = require('jsonwebtoken')

const sign = (data, secret, options = {}) => {
  return jwt.sign(data, secret, options)
}

const verify = (token, secret) => {
  return jwt.verify(token, secret)
}

module.exports = {
  sign,
  verify
}


