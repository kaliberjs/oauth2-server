// This construction allows the API to live in the services directory
// without causing an infinite loop by it calling require('@kaliber/config')

const isProduction = process.env.NODE_ENV === 'production'

module.exports = (...args) => {
  if (!isProduction) Object.keys(require.cache).forEach(x => { delete require.cache[x] })
  return require('../services/api-handler')(...args)
}
