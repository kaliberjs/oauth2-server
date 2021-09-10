const fetch = require('node-fetch').default

const VALID_CLIENT_ID = 'valid-client'
const VALID_REDIRECT_URL = 'valid-test-url'

describe('test api', () => {
  describe('/authorize', () => {
    it ('returns "invalid_request: client_id parameter missing" when no client_id is supplied', async () => {
      const res = await fetch('http://localhost:8000/authorize')
      const body = await res.text()

      expect(res.status).toBe(200)
      expect(body).toContain('invalid_request: client_id parameter missing')
    })

    it ('returns "invalid_request: redirect_url parameter missing" when no client_id is supplied', async () => {
      testResponse({
        path: `http://localhost:8000/authorize?client_id=${VALID_CLIENT_ID}`,
        expect: ({ response, body }) => {
          expect(response.status).toBe(200)
          expect(body).toContain('invalid_request: redirect_url parameter missing')
        },
      })

    })

    it ('returns the authorize page when all is fine', async () => {
      try {
        const path = `http://localhost:8000/authorize?client_id=${VALID_CLIENT_ID}&redirect_url=${VALID_REDIRECT_URL}`
        const expectedStatus = 200
        const expectedBodyToContain = 'Want to authorize?'

        const res = await fetch(path)

        const body = await res.text()
        expect(res.status).toBe(expectedStatus)
        expect(body).toContain(expectedBodyToContain)
      } catch (e) {
      }
    })
  })
})

async function testResponse({ path, expect }) {
  const response = await fetch(path)

  const body = await response.text()
  expect({ response, body })
}
