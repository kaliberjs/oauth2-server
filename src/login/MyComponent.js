import { useEffect, useState } from 'react'
import { useLogin } from '/hooks/useLogin'
import { redirect } from '/util/redirect'

export function MyComponent() {

  const { login, logingIn, logedin } = useLogin()

  const [username, setUsername ] = useState('rick')
  const [password, setPassword ] = useState('pass')

  useEffect(() => {
    if (logedin) {
      redirect(`/authorize${window.location.search}`)
    }
  }, [logedin])

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
