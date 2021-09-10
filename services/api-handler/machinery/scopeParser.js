
module.exports = {
  parse
}

const SCOPE_SEPERATOR = ' '

function parse(scopeString) {
  return scopeString.split(SCOPE_SEPERATOR)
}
