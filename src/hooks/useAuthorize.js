import { request } from '/util/request'
import { setPersistent, getPersistent } from '/util/persistState'
import { serialize } from '/util/serialize'

const AUTHORIZED_KEY = 'authorization_code'
const AUTHORIZE_PATH = '/api/authorize'

export const useAuthorize = () => {
  const [code, setCode] = React.useState()
  const [authorizeing, setAuthorizeing] = React.useState(false)

  React.useEffect(() => {
    const code = getPersistent(AUTHORIZED_KEY)

    if (code) {
      setCode(code)
    }
  }, [])

  const authorize = ({ username, id }) => {
    setAuthorizeing(true)

    request (AUTHORIZE_PATH, serialize({ username, id }))
      .then(res => {
        return res.json()
      })
      .then(data => {
        console.log(data)
        if (data.code) {
          setPersistent(AUTHORIZED_KEY, data.code)

          setCode(data.code)
          setAuthorizeing(false)
        }
      })
  }

  return { authorize, authorizeing, code }
}
