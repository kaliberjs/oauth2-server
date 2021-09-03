export const setPersistent = (key, value) => {
  window.localStorage.setItem(key, value)
}

export const getPersistent = (key) => {
  return window.localStorage.getItem(key)
}
