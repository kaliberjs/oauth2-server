export  const serialize = (data) => {
  return JSON.stringify(data)
}

export  const deserialize = (string) => {
  return JSON.parse(string)
}
