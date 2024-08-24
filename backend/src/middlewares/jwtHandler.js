const jwt = require("jsonwebtoken")
const config = require('../config/jwt.config')

class TokenController {
  
  async signJWT(payload) {
    const token = await jwt.sign(payload, config.secret, {
      expiresIn: "1d",
    })
    return token
  }

  async verifyJWT(req, res, next) {
    try {
        const token = req.headers.authorization;
        console.log(`@@@@@@@@@@${token}`)

        if (!token) {
            const error = new Error('Did not have JWT.')
            error.status = 403
            throw error
        }
        const rtoken = token.replace("Bearer ", "");
        const result = await jwt.verify(rtoken, config.secret);
        
        // check token expire
        if (result.expired) {
            const error = new Error('Expired JWT')
            error.status = 403
            throw error
        }
        req.user = result;

        return next();
    } catch (error) {
        next(error)
    }
}
}

module.exports = new TokenController()
