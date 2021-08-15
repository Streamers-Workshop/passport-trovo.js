var jwt = require('jsonwebtoken');
var OAuth2Strategy = require("passport-oauth2");
var InternalOAuthError = OAuth2Strategy.InternalOAuthError;

var instance = null;
class Strategy extends OAuth2Strategy {
  constructor(options, verify) {
    options = options || {};
    options.authorizationURL = options.authorizationURL || "http://cdn.trovo.live/page/login.html";
    options.tokenURL = options.tokenURL || "https://open-api.trovo.live/openplatform/validate";
    options.scopeSeparator = options.scopeSeparator || '+';
    options.customHeaders = options.customHeaders || {};

    if (!options.customHeaders['User-Agent']) {
      options.customHeaders['User-Agent'] = options.userAgent || 'passport-trovo.js';
    }

    super(options, verify);

    this.name = "trovo.js";
    this._options = options;
    //this._oauth2.setAuthMethod("Bearer");
    this._oauth2.useAuthorizationHeaderforGET(true);
    instance = this;
  }
  userProfile(token, done) {
    this._oauth2.get("https://open-api.trovo.live/openplatform/getuserinfo", token, function (err, body, res) {
      if (err) {
        return done(new InternalOAuthError("failed to fetch user profile", err));
      }
      try {
        var profile = JSON.parse(body);
      } catch(e) {
        return done(e);
      }
      profile.provider = 'trovo.js';
      profile.accessToken = token;
      return done(null, profile);
    });
  }
  authorizationParams(options) {
    var params = {}
    if (options.permissions != undefined) {
      params.permissions = options.permissions;
    }
    if (options.scope != undefined) {
      if (options.scope instanceof Array) {
        params.scope = options.scope.join(options.scopeSeparator);
      }
      if (options.scope instanceof String) {
        params.scope = options.scope;
      }
    }
    return params
  }
}

module.exports = Strategy;
