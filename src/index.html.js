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
      <title>Kaliber OAuth server</title>
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
      <App
        clientConfig={config.client}
        universalContainerProps={{ style: { height: '100%' } }}
      />
    </body>
  </html>
)

