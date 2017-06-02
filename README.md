# JWT-Express
This is an express middleware generator that issues and parses JSON web tokens. It can be used for authentication and session data.

## Installation
As this package probably wont be published to NPM any time soon, it will require installing directly from github (which can be done with npm)

either use npm in the command line
```
npm install github:fnvi/JWT-Express
```
or add
```
"jwt-express": "github:fnvi/JWT-Express"
```
to your package.json file

## Usage

First create an object, passing in the secret, the http header, the expiry time, a callback method for setting the payload for issuing and a callback method for using the payload upon recieving.
```javascript
var JWTExpress = require('jwt-express');
var secret = "secret", header = "X-Access-Token";
var jwt = new JWTExpress(secret, header,"10m",function(req,res,setPayload){
  /**
  * Call set payload when finished, and pass in any object you like
  */
  setPayload({anything:"you want"});
},function(req, payload, next){
  /**
  * Do what you want with the payload, and call the next function (just like express)
  */
  req.payload = payload;
  next();
});
```

you will then be able to call the issue and verify methods to insert middleware.
```javascript

/**
* Issue tokens
*/
app.post('/issue',jwt.issue(),function(req,res){ res.sendStatus(204); });

/**
* Secure all routes
*/
app.use(jwt.verify());

/**
* Secure one route
*/
app.get('/secure',jwt.verify(),function(req,res){ res.sendStatus(204); });

/**
* Secure a route that requires permissions (this requires the request object to have a permissions array, req.permissions)
*/
app.('/restricted',jwt.permissions(["some","permissions"]),function(req,res){ res.sendStatus(204); });
```
