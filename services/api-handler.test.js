const apiHandler = require('./api-handler')

const INVALID_USER = 'invalid-user'
const VALID_USER = 'valid-user'

const VALID_PASSWORD = 'valid-password'

const INVALID_CLIENT = 'invalid-client'
const VALID_CLIENT = 'valid-client'

const INVALID_SCOPE = 'invalid scoPe'
const VALID_SCOPE = 'valid scope'

const INVALID_AUTHENTICATION_TOKEN = 'invalid-authentication-token'
const VALID_AUTHENTICATION_TOKEN = 'valid-authentication-token'

const INVALID_REFRESH_TOKEN = 'invalid-refresh-token'
const VALID_REFRESH_TOKEN = 'valid-refresh-token'


const INVALID_REDIRECT_URL = 'invalid-test-url'
const VALID_REDIRECT_URL = 'valid-test-url'

const INVALID_AUTHORIZATION_TOKEN = 'invalid-authorization-token'
const VALID_AUTHORIZATION_TOKEN = 'valid-authorization-token'

const INVALID_GRANT = 'invalid-grant'
const VALID_GRANT = 'authorization_code'
const AUTHORIZATION_CODE_GRANT = 'authorization_code'
const REFRESH_TOKEN_GRANT = 'refresh_token'

const ACCESS_TOKEN = 'access-token'

jest.mock('./api-handler/machinery/jwt', () => {
  return {
    makeRefreshToken: () => VALID_REFRESH_TOKEN,
    makeAccessToken: () => ACCESS_TOKEN,
    makeAuthenticationToken:() => VALID_AUTHENTICATION_TOKEN,
    makeAuthorizationToken:() => VALID_AUTHORIZATION_TOKEN,
    verifyRefreshToken: (token) => token === VALID_REFRESH_TOKEN,
    verifyAuthorizationToken: (token) => token === VALID_AUTHORIZATION_TOKEN,
  }
})

describe ('api-handler', () => {
  it ('returns a 405 when the request METHOD is not supported', async () => {
    const location = { pathname: '' }
    const request = { method: 'DELETE' }
    const expected = { status: 405 }
    const actual = await apiHandler(location, request)

    expect(actual).toEqual(expected)
  })

  describe('GET', () => {
    describe('For any path', () => {
      const location = { pathname: '/api/' }
      it ('will return the same', async () => {

        const req = {
          method: 'GET',
        }

        const expected = {
          status: 200,
          data:  null,
          headers: null,
        }
        const actual = await apiHandler(location, req)

        expect(actual).toEqual(expected)
      })
    })
  })

  describe('POSTS ', () => {
    describe('Unsupported path', () => {
      it('returns a 404', async () => {
        const location = { pathname: '/nothing-to-find' }
        const req = {
          method: 'POST',
          body: {}
        }

        const expected = {
          status: 404,
          data: {
            body: {
              message: 'resource not found'
            }
          },
        }
        const actual = await apiHandler(location, req)

        expect(actual).toEqual(expected)
      })
    })




    describe('/api/authenticate', () => {
      const location = { pathname: `/api/authenticate` }

      it('return bad request when no body was provided', async () => {
        const req = {
          method: 'POST',
        }

        const expected = {
          status: 400,
          data: {
            body: {
              message: 'No body provided',
            },
          }
        }

        const actual = await apiHandler(location, req)

        expect(actual).toEqual(expected)
      })

      it('return Invalid credentials when the wrong login is provided', async () => {
        const req = {
          method: 'POST',
          body: {
            username: INVALID_USER,
            password: VALID_PASSWORD
          }
        }

        const expected = {
          status: 401,
          data: {
            body: {
              message: 'Invalid credentials',
            },
          }
        }

        const actual = await apiHandler(location, req)

        expect(actual).toEqual(expected)
      })

      it('return a session cookie when all is fine', async () => {
        const req = {
          method: 'POST',
          query: {
            redirect_url: VALID_REDIRECT_URL
          },
          body: {
            username: VALID_USER,
            password: VALID_PASSWORD
          }
        }

        const expected = {
          status: 303,
          data: {
            body: {
              logedin:true
            },
          },
          headers: {
            'Set-Cookie': 'session=valid-authentication-token; Path=/ Secure; HttpOnly',
          }
        }

        const actual = await apiHandler(location, req)

        expect(actual).toEqual(expected)
      })
    })




    describe('/api/authorize', () => {
      const location = { pathname: '/api/authorize' }

      it('returns invalid_request client_id parameter missing when the client_id is missing', async () => {
        const req = {
          method: 'POST',
          query: {
            redirect_url: VALID_REDIRECT_URL,
            state: '123',
          },
          body: {
            grant_type: VALID_GRANT
          }
        }

        const expected = {
          status: 400,
          data: {
            body: {
              'error': 'invalid_request',
              'error_description': 'client_id parameter missing'
            },
          }
        }
        const actual = await apiHandler(location, req)

        expect(actual).toEqual(expected)
      })

      it('returns invalid_request when the client_id is missing', async () => {
        const req = {
          method: 'POST',
          query: {
            client_id: INVALID_CLIENT,
            redirect_url: INVALID_REDIRECT_URL,
            state: '123',

          },
          body: {
            grant_type: VALID_GRANT
          }
        }

        const expected = {
          status: 400,
          data: {
            body: {
              'error': 'invalid_request',
              'error_description': 'client_id parameter missing'
            },
          }
        }
        const actual = await apiHandler(location, req)

        expect(actual).toEqual(expected)
      })

      it('returns invalid_request scope parameter missing when the scope is missing', async () => {
        const req = {
          method: 'POST',
          query: {
            client_id: VALID_CLIENT,
            redirect_url: VALID_REDIRECT_URL,
            state: '123',

          },
          body: {
            grant_type: VALID_GRANT
          }
        }

        const expected = {
          status: 400,
          data: {
            body: {
              'error': 'invalid_request',
              'error_description': 'scope parameter missing'
            },
          }
        }
        const actual = await apiHandler(location, req)

        expect(actual).toEqual(expected)
      })

      it('returns invalid_request redirect_url parameter missing when the redirect_url is missing', async () => {
        const req = {
          method: 'POST',
          query: {
            client_id: VALID_CLIENT,
            state: '123',
            scope: VALID_SCOPE
          },
          body: {
            grant_type: VALID_GRANT
          }
        }

        const expected = {
          status: 400,
          data: {
            body: {
              'error': 'invalid_request',
              'error_description': 'redirect_url parameter missing'            },
          }
        }
        const actual = await apiHandler(location, req)

        expect(actual).toEqual(expected)
      })

      it('returns invalid_redirect_url when the redirect_url is invalid', async () => {
        const req = {
          method: 'POST',
          query: {
            client_id: VALID_CLIENT,
            redirect_url: INVALID_REDIRECT_URL,
            state: '123',
            scope: VALID_SCOPE
          },
          body: {
            grant_type: VALID_GRANT
          }
        }

        const expected = {
          status: 400,
          data: {
            body: {
              'error': 'invalid_redirect_url',
            },
          }
        }
        const actual = await apiHandler(location, req)

        expect(actual).toEqual(expected)
      })

      it('returns invalid_scope when the scope is not allowed', async () => {
        const req = {
          method: 'POST',
          query: {
            client_id: VALID_CLIENT,
            redirect_url:VALID_REDIRECT_URL,
            state: '123',
            scope: INVALID_SCOPE
          },
          body: {
            grant_type: VALID_GRANT
          }
        }

        const expected = {
          status: 400,
          data: {
            body: {
              'error': 'invalid_scope'
            },
          }
        }
        const actual = await apiHandler(location, req)

        expect(actual).toEqual(expected)
      })

      it('returns accessToken and redirectUrl when all is good', async () => {
        const req = {
          method: 'POST',
          query: {
            client_id: VALID_CLIENT,
            redirect_url:VALID_REDIRECT_URL,
            state: '123',
            scope: VALID_SCOPE
          },
          body: {
            grant_type: VALID_GRANT
          }
        }

        const expected = {
          status: 200,
          data: {
            body: {
              redirectUrl: 'valid-test-url?code=valid-authorization-token&state=123'
            },
          },
          headers: {
            'Set-Cookie': 'accessToken=valid-authorization-token; Path=/',
          }
        }
        const actual = await apiHandler(location, req)

        expect(actual).toEqual(expected)
      })


    })




    describe('/api/access', () => {
      const location = { pathname: '/api/access' }

      it('returns invalidRequest when the client_id parameter is missing', async () => {
        const req = {
          method: 'POST',
          body: {
            grant_type: VALID_GRANT
          }
        }

        const expected = {
          status: 400,
          data: {
            body: {
              error: 'invalid_request',
              error_description: 'client_id parameter missing',
            },
          },
        }
        const actual = await apiHandler(location, req)

        expect(actual).toEqual(expected)
      })

      it('returns invalidClient when there is something wrong with the client_id parameter', async () => {
        const req = {
          method: 'POST',
          body: {
            grant_type: VALID_GRANT,
            client_id: INVALID_CLIENT
          }
        }

        const expected = {
          status: 400,
          data: {
            body: {
              error: 'invalid_client'
            },
          },
        }
        const actual = await apiHandler(location, req)

        expect(actual).toEqual(expected)
      })

      it ('returns invalidRequest when the grant_type parameter is missing', async () => {
        const req = {
          method: 'POST',
          body:{
            client_id: VALID_CLIENT
          }
        }

        const expected = {
          status: 400,
          data:  {
            body:  {
              error: 'invalid_request',
              error_description: 'grant_type parameter missing',
            },
          },
        }
        const actual = await apiHandler(location, req)

        expect(actual).toEqual(expected)
      })





      it('returns a invalid grant response when there is an unsupported grant provided', async () => {
        const req = {
          method: 'POST',
          body: {
            grant_type: INVALID_GRANT,
            client_id: VALID_CLIENT,
            redirect_url: VALID_REDIRECT_URL
          }
        }

        const expected = {
          status: 400,
          data: {
            body: {
              error: 'invalid_grant type'
            },
          },
        }
        const actual = await apiHandler(location, req)

        expect(actual).toEqual(expected)
      })




      describe('the code grant_type flow', () => {
        it('returns invalidRequest when the redirect_url parameter is missing', async () => {
          const req = {
            method: 'POST',
            body: {
              grant_type: AUTHORIZATION_CODE_GRANT,
              client_id: VALID_CLIENT
            }
          }

          const expected = {
            status: 400,
            data: {
              body: {
                error: 'invalid_request',
                error_description: 'redirect_url parameter missing',
              },
            },
          }
          const actual = await apiHandler(location, req)

          expect(actual).toEqual(expected)
        })

        it ('returns invalidRequest when the code parameter is missing', async () => {
          const req = {
            method: 'POST',
            body: {
              grant_type: AUTHORIZATION_CODE_GRANT,
              client_id: VALID_CLIENT,
              redirect_url: VALID_REDIRECT_URL
            }
          }

          const expected = {
            status: 400,
            data: {
              body: {
                error: 'invalid_request',
                error_description: 'code parameter missing',
              },
            },
          }
          const actual = await apiHandler(location, req)

          expect(actual).toEqual(expected)
        })

        it ('return invalidRedirectUrl when the redirect_url is not valid', async () => {
          const req = {
            method: 'POST',
            body: {
              grant_type: AUTHORIZATION_CODE_GRANT,
              client_id: VALID_CLIENT,
              code: INVALID_AUTHORIZATION_TOKEN,
              redirect_url: INVALID_REDIRECT_URL
            }
          }

          const expected = {
            status: 400,
            data: {
              body: {
                error: 'invalid_redirect_url'
              },
            },
          }
          const actual = await apiHandler(location, req)

          expect(actual).toEqual(expected)
        })

        it ('return invalidAuthorizationToken when the code is not valid', async () => {
          const req = {
            method: 'POST',
            body: {
              grant_type: AUTHORIZATION_CODE_GRANT,
              client_id: VALID_CLIENT,
              code: INVALID_AUTHORIZATION_TOKEN,
              redirect_url: VALID_REDIRECT_URL
            }
          }

          const expected = {
            status: 400,
            data: {
              body: {
                error: 'invalid_authorization_token'
              },
            },
          }
          const actual = await apiHandler(location, req)

          expect(actual).toEqual(expected)
        })

        it ('returns a accessTokenResponse', async () => {
          const req = {
            method: 'POST',
            body: {
              grant_type: AUTHORIZATION_CODE_GRANT,
              client_id: VALID_CLIENT,
              code: VALID_AUTHORIZATION_TOKEN,
              redirect_url: VALID_REDIRECT_URL
            }
          }

          const expected = {
            status: 200,
            data: {
              body: {
                refresh_token : VALID_REFRESH_TOKEN,
                access_token: ACCESS_TOKEN,
                token_type: 'bearer',
                expiresIn: 3600,
                scope: 'any'
              },
            },
            headers: {
              'Cache-Control': 'no-store',
              Pragma: 'no-cache',
            },
          }
          const actual = await apiHandler(location, req)

          expect(actual).toEqual(expected)
        })
      })




      describe('the refresh_token grant_type flow', () => {
        it('returns invalidRequest when the client_id parameter is missing', async () => {
          const req = {
            method: 'POST',
            body: { grant_type: REFRESH_TOKEN_GRANT }
          }

          const expected = {
            status: 400,
            data: {
              body: {
                error: 'invalid_request',
                error_description: 'client_id parameter missing',
              },
            },
          }
          const actual = await apiHandler(location, req)

          expect(actual).toEqual(expected)
        })

        it('returns invalidRequest when the redirect_url parameter is missing', async () => {
          const req = {
            method: 'POST',
            body: {
              grant_type: REFRESH_TOKEN_GRANT,
              client_id: VALID_CLIENT
            }
          }

          const expected = {
            status: 400,
            data: {
              body: {
                error: 'invalid_request',
                error_description: 'redirect_url parameter missing',
              },
            },
          }
          const actual = await apiHandler(location, req)

          expect(actual).toEqual(expected)
        })

        it('returns invalidRequest when the refresh_token parameter is missing', async () => {
          const req = {
            method: 'POST',
            body: {
              grant_type: REFRESH_TOKEN_GRANT,
              client_id: VALID_CLIENT,
              redirect_url: VALID_REDIRECT_URL
            }
          }

          const expected = {
            status: 400,
            data: {
              body: {
                error: 'invalid_request',
                error_description: 'refresh_token parameter missing',
              },
            },
          }
          const actual = await apiHandler(location, req)

          expect(actual).toEqual(expected)
        })

        it('returns invalidRefreshToken when there is something wrong with the refresh_token', async () => {
          const req = {
            method: 'POST',
            body: {
              grant_type: REFRESH_TOKEN_GRANT,
              client_id: VALID_CLIENT,
              redirect_url: VALID_REDIRECT_URL,
              refresh_token: INVALID_REFRESH_TOKEN
            }
          }

          const expected = {
            status: 400,
            data: {
              body: {
                error: 'invalid_refresh_token',
              },
            },
          }
          const actual = await apiHandler(location, req)

          expect(actual).toEqual(expected)
        })

        it ('return invalidRedirectUrl when the redirect_url is not valid', async () => {
          const req = {
            method: 'POST',
            body: {
              grant_type: REFRESH_TOKEN_GRANT,
              client_id: VALID_CLIENT,
              refresh_token: INVALID_REFRESH_TOKEN,
              redirect_url: INVALID_REDIRECT_URL
            }
          }

          const expected = {
            status: 400,
            data: {
              body: {
                error: 'invalid_redirect_url'
              },
            },
          }
          const actual = await apiHandler(location, req)

          expect(actual).toEqual(expected)
        })

        it ('gives access_token response', async () => {
          const req = {
            method: 'POST',
            body: {
              grant_type: REFRESH_TOKEN_GRANT,
              client_id: VALID_CLIENT,
              redirect_url: VALID_REDIRECT_URL,
              refresh_token: VALID_REFRESH_TOKEN
            }
          }

          const expected = {
            status: 200,
            data: {
              body: {
                access_token: ACCESS_TOKEN,
                expiresIn: 3600,
                scope: 'any',
                token_type: 'bearer',
              },
            },
            headers:  {
              'Cache-Control': 'no-store',
              Pragma: 'no-cache',
            },
          }
          const actual = await apiHandler(location, req)

          expect(actual).toEqual(expected)
        })
      })
    })
  })
})

