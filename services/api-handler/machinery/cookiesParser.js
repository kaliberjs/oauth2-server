
const NAME_VALUE_SEPERATOR = '='
const COOKIE_SEPERATOR = '; '

export function parseCookies(req) {
  if (req.headers.cookie === undefined) {
    return {}
  }

  return req.headers.cookie.split(COOKIE_SEPERATOR)
    .reduce(
      (output, input) => {
        const [name, value] = input.split(NAME_VALUE_SEPERATOR)

        return {
          ...output,
          [name]: value
        }
      },
      {})
}
