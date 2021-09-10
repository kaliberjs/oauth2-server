import { useEffect, useState } from 'react'
import { useLogin } from '/hooks/useLogin'
import { redirect } from '/util/redirect'

export function MyComponent() {

  const { login, logingIn, loggedIn } = useLogin()

  const [username, setUsername ] = useState('valid-user')
  const [password, setPassword ] = useState('valid-password')

  useEffect(
    () => {
      if (loggedIn) {
        // redirect(`/authorize${window.location.search}`)
      }
    },
    [loggedIn]
  )

  return (
    <div>
      <div>
        <label>Username:</label>
        <input type="text" onChange={setUsername} value={username} disabled={logingIn} />
      </div>
      <div>
        <label>Password:</label>
        <input  type="password" onChange={setPassword} value={password} disabled={logingIn} />
      </div>
      <div>
        <button onClick={() => login(username, password)} disabled={logingIn}>Login</button>
      </div>
    </div>
  )
}
