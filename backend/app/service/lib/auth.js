let jwt = require('jsonwebtoken');
module.exports = app => {
    return class Auth extends app.Controller {
      /**
       * 
       * @param {*} token 
       */
      async verifyToken(token) {
        if (!token) {
            throw Error("the token is lost")
        }
    
        let key = app.config.tokenKey;
        return jwt.verify(token, key);
    
      }
    }
    return Auth;
  };