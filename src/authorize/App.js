import { useLogin } from '/hooks/useLogin'
import { useAuthorize } from '/hooks/useAuthorize'
import { createUrl, parseUrl } from '/util/url'
import { redirect } from '/util/redirect'

export default function App({ location, clientConfig }) {
  const { logedin } = useLogin()
  const { authorize, code, authorizeing } = useAuthorize()

  React.useEffect(() => {
    if (logedin === false) {
      redirect(`/login${window.location.search}`)
    }

    if (code) {
      const { searchParams: { redirect_uri, state } } = parseUrl(window.location)


      redirect(createUrl(redirect_uri, {
        code,
        state
      }))
    }
  }, [logedin, code])

  React.useEffect(() => {}, [])

  return (
    <div>
      <button onClick={() => authorize(logedin.username, logedin.id)} disabled={authorizeing}>Accept</button>
      <input type="submit" name="reject" value="reject (doet niets)"  disabled={authorizeing} />
    </div>
  )
}
