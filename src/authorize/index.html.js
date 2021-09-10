import config from '@kaliber/config'
import App from './App?universal'

import stylesheet from '@kaliber/build/lib/stylesheet'
import javascript from '@kaliber/build/lib/javascript'
import polyfill from '@kaliber/build/lib/polyfill'

import '/index.css'

import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

const { parseCookies  } = require('../../services/api-handler/machinery/cookiesParser')
const {  verifyAuthenticationToken } = require('../../services/api-handler/machinery/jwt')

const { validateAuthorizeGetDisplayErrors  } = require('../../services/api-handler/machinery/validateRequest')
const queryClient = new QueryClient()

function findApp(clientId) {
  return config.apps.find(app => app.clientId === clientId)
}

Index.routes = {
  match: async (_, req) => {
    const {
      client_id,
      redirect_url,
      state
    } = req.query

    const clientConfig = findApp(client_id)
    const validationResponse = validateAuthorizeGetDisplayErrors(req.query, clientConfig)

    if (validationResponse !== null) {
      return {
        status:200,
        data: {
          missingParam: `${validationResponse.error}: ${validationResponse.error_description}`
        },
        headers: null
      }
    }

    const { session, accessToken } = parseCookies(req)

    if (accessToken) {
      return {
        status:303,
        data: {},
        headers: {
          'Location': `${redirect_url}?code=${accessToken}&state=${state}`
        }
      }
    }

    try {
      verifyAuthenticationToken(session, config)
    } catch (e) {

      return {
        status:303,
        data: {},
        headers: {
          // it doesn't look like I'm supposed to use _parsedOriginalUrl
          'Location': `/login${req._parsedOriginalUrl.search}`
        }
      }
    }

    return { status:200, data: {}, headers: null }
  }
}

export default function Index({ data: { missingParam } }) {
  return (<html lang="nl">
    <head>
      <meta charSet="utf-8" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <title>Authorize</title>
      <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />

      <link rel="apple-touch-icon" sizes="180x180" href="/static/favicon/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/static/favicon/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/static/favicon/favicon-16x16.png" />
      <link rel="mask-icon" href="/static/favicon/safari-pinned-tab.svg" color="#0000A4" />
      <meta name="theme-color" content="#0000A4" />

      {stylesheet}
      {polyfill(['default', 'es2015', 'es2016', 'es2017', 'IntersectionObserver', 'ResizeObserver', 'matchMedia', 'requestIdleCallback'])}
      {javascript}
    </head>
    <body>
      {missingParam ? <div>{missingParam}</div> : <QueryClientProvider client={queryClient}>
        <App
          clientConfig={config.client}
          universalContainerProps={{ style: { height: '100%' } }}
        />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>}
    </body>
  </html>
  )
}

