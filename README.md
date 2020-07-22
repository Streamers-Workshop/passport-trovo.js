# passport-trovo.js

![Build Status](https://img.shields.io/travis/Bioblaze/passport-trovo.js.svg)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

![Downloads](https://img.shields.io/npm/dm/passport-trovo.js.svg)
![Downloads](https://img.shields.io/npm/dt/passport-trovo.js.svg)
![npm version](https://img.shields.io/npm/v/passport-trovo.js.svg)
![License](https://img.shields.io/npm/l/passport-trovo.js.svg)

![dependencies](https://img.shields.io/david/Bioblaze/passport-trovo.js.svg)
![dev dependencies](https://img.shields.io/david/dev/Bioblaze/passport-trovo.js.svg)

[![Code Climate](https://codeclimate.com/github/Bioblaze/passport-trovo.js/badges/gpa.svg)](https://codeclimate.com/github/Bioblaze/passport-trovo.js)
[![Trovo Chat](https://img.shields.io/trovo/165374225320771586.svg)](https://discord.gg/abQqEEC)  
[![PayPal](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://paypal.me/BioblazePayne)

Trovo is a trademark or registered trademark of TLive LLC. in the U.S. and/or other countries. "passport-trovo.js" is not operated by, sponsored by, or affiliated with TLive LLC. in any way.

[Passport](http://passportjs.org/) strategies for authenticating with [Trovo](https://trovo.live/)
using OAuth 2.0 API.

This module lets you authenticate using Trovo in your Node.js applications.
By plugging into Passport, Trovo authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install
```bash
$ npm install passport-trovo.js
```
## Usage of OAuth 2.0

#### Configure Strategy

The Trovo OAuth 2.0 authentication strategy authenticates users using a Trovo
account and OAuth 2.0 tokens. The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a client ID, client secret, and callback URL.

```javascript
var passport       = require("passport");
var trovoStrategy = require("passport-trovo.js").Strategy;

passport.use(new trovoStrategy({
    clientID: TROVO_CLIENT_ID,
    clientSecret: TROVO_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/trovo/callback",
    scope: ["guilds", "connections", "email"]
  },
  function(accessToken, refreshToken, profile, done) {
    //Handle Database Query Addition Here.
  }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `"trovo.js"` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```javascript
app.get("/auth/trovo", passport.authenticate("trovo.js"));
app.get("/auth/trovo/callback", passport.authenticate("trovo.js", { failureRedirect: "/" }), function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
});
```

The request to this route should include a GET or POST data with the keys `access_token` from Trovo.

```
GET /auth/trovo?access_token=<TOKEN>
```

## Issues

If you receive a `401 Unauthorized` error, it is most likely because you have wrong access token or not yet specified any application permissions.
Once you refresh access token with new permissions, try to send this access token again.

## Example

```javascript
#!/bin/env node

require('dotenv').config();

var express = require('express');
var session = require('express-session');
var helmet = require('helmet');
var bodyParser = require('body-parser');

var passport = require('passport');
var refresh = require('passport-oauth2-refresh');
var _strategy = require('passport-trovo.js').Strategy;

var app = express();

app.use(session({
  key: process.env.SESSION_KEY,
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: true
  }
}));

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

passport.serializeUser(function(u, d) {
  d(null, u);
});
passport.deserializeUser(function(u, d) {
  d(null, u);
});

var TrovoStrategy = new _strategy({
  clientID: process.env.TROVO_ID,
  clientSecret: process.env.TROVO_SECRET,
  callbackURL: "http://127.0.0.1:3000/auth/trovo/callback",
  scope: ["guilds", "connections", "email"]
}, function(accesstoken, refreshToken, profile, done) {
  console.log(profile);
  return done(null, profile);
});

passport.use(TrovoStrategy);
refresh.use(TrovoStrategy);

app.get('/', function(req, res) {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    res.send(`Hello ${req.session.user.username}`);
  }
});

app.get('/login', passport.authenticate('trovo.js'}));
app.get('/auth/trovo/callback', passport.authenticate('trovo.js', { failureRedirect: '/' }), function(req, res) {
  req.session.user = req.user;
  console.log(req.user);
  console.log(req.query);
  res.redirect('/');
});
app.listen(process.env.SITE_PORT, process.env.SITE_HOST, function() {
  console.log(`Express Started`);
});

```

Projected Maintained by: Randolph Aarseth(Bioblaze Payne)
