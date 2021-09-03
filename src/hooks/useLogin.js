import { useState, useEffect } from 'react'
import { request } from '/util/request'
import { setPersistent, getPersistent } from '/util/persistState'
import { serialize, deserialize } from '/util/serialize'

const AUTHENTICATE_PATH = '/api/authenticate'
const LOGEDIN_KEY = 'is_logedin'

export const useLogin = () => {
  const [logedin, setLogedin] = useState()
  const [logingIn, setLogingIn] = useState(false)

  useEffect(() => {
    const userData = getPersistent(LOGEDIN_KEY)

    setLogedin(userData
      ? deserialize(userData)
      : false)
  }, [])

  const login = (username, password) => {
    setLogingIn(true)

    request(AUTHENTICATE_PATH, serialize({ username, password }))
      .then(res => {
        return res.json()
      })
      .then(data => {
        setLogingIn(false)

        if (data) {
          const userData = { username: data.username, id:data.id }
          setLogedin(userData)

          setPersistent(LOGEDIN_KEY, serialize({ username: data.username, id:data.id }))
        }
      })
      .catch(e => console.error(e))
  }

  return { login, logingIn, logedin }
}
