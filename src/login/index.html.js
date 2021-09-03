import config from '@kaliber/config'
import App from './App?universal'

import stylesheet from '@kaliber/build/lib/stylesheet'
import javascript from '@kaliber/build/lib/javascript'
import polyfill from '@kaliber/build/lib/polyfill'

import '/index.css'

export default (
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
      <App
        clientConfig={config.client}
        universalContainerProps={{ style: { height: '100%' } }}
      />
    </body>
  </html>
)

