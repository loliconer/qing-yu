const jwt = require('jsonwebtoken')
const config = require('./config')

module.exports = {
  jwtVerify(req, res, next) {
    const token = req.headers['x-access-token']

    jwt.verify(token, config.secret, (err, decode) => {
      if (err) return res.json({ code: 105, msg: 1 })

      req.user = decode
      next()
    })
  },
  adminRequired(req, res, next) {
    const isAdmin = req.user.roles.split(',').includes('99')

    isAdmin ? next() : res.json({ code: 114, msg: 1 })
  }
}
