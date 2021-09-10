import { useState } from 'react'
import { request } from '/util/request'
import { redirect } from '/util/redirect'

const AUTHENTICATE_PATH = '/api/authenticate'

export const useLogin = () => {
  const [logingIn, setLogingIn] = useState(false)

  return { login, logingIn }

  async function login(username, password) {
    setLogingIn(true)

    try {
      const res = await request(AUTHENTICATE_PATH, JSON.stringify({ username, password }))
      const data = await res.json()

      if (data && data.logedin) {
        redirect(`/login${window.location.search}`)
      }
    } catch (e) {
      console.error(e)
    }

  }
}
