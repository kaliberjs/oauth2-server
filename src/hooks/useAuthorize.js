import { request } from '/util/request'
import { redirect } from '/util/redirect'

const AUTHORIZE_PATH = '/api/authorize'

export const useAuthorize = () => {
  const [authorizeing, setAuthorizeing] = React.useState(false)

  return { authorize, authorizeing }

  async function authorize(accept) {
    setAuthorizeing(true)

    const res = await request(
      `${AUTHORIZE_PATH}${window.location.search}`,
      JSON.stringify({
        authorize: accept
      })
    )

    const { redirectUrl } = await res.json()

    if (redirectUrl) {
      redirect(redirectUrl)
    }
  }
}
