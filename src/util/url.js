export const createUrl = (path, params = {}) => {
  return Object.keys(params).reduce(
    (out, input) => {
      out.searchParams.set(input, params[input])
      return out
    }
    , new URL(path))
}

export const parseUrl = (url) => {
  const parseUrl = new URL(url)

  return {
    searchParams: Array.from(parseUrl.searchParams)
      .reduce(
        (out, input) => {
          return {
            ...out,
            [input[0]]: input[1]
          }
        },
        {})
  }
}
