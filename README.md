# OAuth 2 Server

## Register Application (can just be config)
  - client ID (The client_id is a public identifier for apps. Even though it’s public, it’s best that it isn’t guessable by third parties)
  - client secret? (The client_secret is a secret known only to the application and the authorization server. It must be sufficiently random to not be guessable)
  - callback-url / redirect-url (server should never redirect to any other url)

### client ID examples
Foursquare: ZYDPLLBWSK3MVQJSIYHB1OR2JXCY0X2C5UJ2QAR2MAAIT5Q
Github: 6779ef20e75817b79602
Google: 292085223830.apps.googleusercontent.com
Instagram: f2a1ed52710d4533bde25be6da03b6e3
SoundCloud: 269d98e4922fb3895e9ae2108cbb5064
Windows Live: 00000000400ECB04


## Authorization Server 
 - authorization code grant type


### request example
```
https://authorization-server.com/auth?response_type=code
&client_id=29352735982374239857
&redirect_uri=https://example-app.com/callback
&scope=create+delete
&state=xcoivjuywkdkhvusuye3kch
```

## Requiring User Login

Voor het opslaan van wachtwoorden houden we deze richtlijnen aan: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#maximum-password-lengths

We zullen gebruik maken van bcrypt (Blowfish) voor het hashen van wachtwoorden.
Voor wachtwoord vergeten gebruiken we de volgende richtlijnen: https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html
Voor ids / keys / tokens gebruiken we https://www.npmjs.com/package/crypto-random-string

In de huidige situatie staan wachtwoorden met plain-text in de database. Deze zullen gehashed (salted en peppered) moeten worden. Vervolgens zal een veteraan bij het inloggen een nieuw wachtwoord moeten instellen.

We krijgen straks een sql database waarmee we verbinding kunnen maken. Maar voor het testen is het prima om een in-memory object / array te gebruiken (wel async)


## The Authorization Interface
 Are we going to do this?

 https://www.oauth.com/oauth2-servers/authorization/the-authorization-interface/


## Obtaining an Access Token




Authorization Server 
plan:

https://authorization-server.com/authorize (JWT sign with secret) -> authorization code
https://authorization-server.com/token (JWT with private key) -> access token

resource server (bearer token JTW validate with public key)

## authorize
http://localhost:8000/authorize/?response_type=code&client_id=fjsyt27-test-app&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&scope=any&state=hAdH3kGAS3gf2kwfy1


## get access token

code:         eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MzA2NTQxNjksImV4cCI6MTYzMDgyNjk2OX0.6ptqgJMO5WuvBc6rK2Lp8PMs1TyVmwTECMNYUnVz0wk
grant_type:   code
redirect_uri: http://localhost:3000/callback
client_id:    fjsyt27-test-app

```
curl \
  -H "Content-Type: application/json" \
  -d '{"code": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MzA2NTQxNjksImV4cCI6MTYzMDgyNjk2OX0.6ptqgJMO5WuvBc6rK2Lp8PMs1TyVmwTECMNYUnVz0wk", "grant_type": "code", "redirect_uri": "http://localhost:3000/callback",  "client_id": "fjsyt27-test-app"}' \
  http://localhost:8000/api/access
```

## use refresh token

refresh_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoid2UgdGhpbmsgYWJvdXQgdGhpcyBsYXRlciIsImlhdCI6MTYzMDY2Mjc3OSwiZXhwIjoxNjMwNjY2Mzc5fQ.ToazYw56vEC3AlKaV9w0tymsceHAlutCRr1QxnJPceY
grant_type:    code
redirect_uri:  http://localhost:3000/callback
client_id:     fjsyt27-test-app

```
curl \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoid2UgdGhpbmsgYWJvdXQgdGhpcyBsYXRlciIsImlhdCI6MTYzMDY2Mjc3OSwiZXhwIjoxNjMwNjY2Mzc5fQ.ToazYw56vEC3AlKaV9w0tymsceHAlutCRr1QxnJPceY", "grant_type": "refresh_token", "redirect_uri": "http://localhost:3000/callback",  "client_id": "fjsyt27-test-app"}' \
  http://localhost:8000/api/access
```


## generate key pair

`openssl genrsa -out config/private.pem 2048 && openssl rsa -in config/private.pem -pubout > config/public.pem`
