const fetch = require('node-fetch')

const VALID_CLIENT_ID = 'valid-client'
const VALID_REDIRECT_URL = 'valid-test-url'

describe('test api', () => {
  describe('/authorize', () => {
    it ('returns "invalid_request: client_id parameter missing" when no client_id is supplied', async () => {
      try {

        const path = 'http://localhost:8000/authorize'
        const expectedStatus = 200
        const expectedBodyToContain = 'invalid_request: client_id parameter missing'

        const res = await fetch(path)

        const body = await res.text()
        expect(res.status).toBe(expectedStatus)
        expect(body).toContain(expectedBodyToContain)
      } catch (e) {
        console.log(e)
      }
    })

    it ('returns "invalid_request: redirect_url parameter missing" when no client_id is supplied', async () => {
      try {

        const path = `http://localhost:8000/authorize?client_id=${VALID_CLIENT_ID}`
        const expectedStatus = 200
        const expectedBodyToContain = 'invalid_request: redirect_url parameter missing'

        const res = await fetch(path)

        const body = await res.text()
        expect(res.status).toBe(expectedStatus)
        expect(body).toContain(expectedBodyToContain)
      } catch (e) {
        console.log(e)
      }
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
