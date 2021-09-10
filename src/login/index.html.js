import config from '@kaliber/config'
import App from './App?universal'

import stylesheet from '@kaliber/build/lib/stylesheet'
import javascript from '@kaliber/build/lib/javascript'
import polyfill from '@kaliber/build/lib/polyfill'

import '/index.css'

import { QueryClient, QueryClientProvider } from 'react-query'
import { redirect } from '/util/redirect'
const { parseCookies  } = require('../../services/api-handler/machinery/cookiesParser')
const {  verifyAuthenticationToken } = require('../../services/api-handler/machinery/jwt')

const queryClient = new QueryClient()

Index.routes = {
  match: async (location, req) => {
    const { session } = parseCookies(req)

    try {
      if (isLoggedIn(session, config)) {
        return redirect(303, `/authorize${location.search}}`)
      }
    } catch (e) {
      return { status:200, data: {}, headers: null }
    }

    return { status:200, data: {}, headers: null }
  }
}

export default function Index() {
  return  (
    <html lang="nl">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <title>Login</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />

        {stylesheet}
        {polyfill(['default', 'es2015', 'es2016', 'es2017', 'IntersectionObserver', 'ResizeObserver', 'matchMedia', 'requestIdleCallback'])}
        {javascript}
      </head>
      <body>
        <QueryClientProvider client={queryClient}>

          <App
            clientConfig={config.client}
            universalContainerProps={{ style: { height: '100%' } }}
          />
        </QueryClientProvider>

      </body>
    </html>
  )
}

