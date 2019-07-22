const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function (req, res, next) {
  // Get Token From Heraders
  const token = req.header('x-auth-token')

  // Check If No Token
  if (!token) {
    return res.status(401).json({ msg: 'No Token! Authorization Denied' })
  }

  // Verify Token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'))
    req.user = decoded.user
    next()
  } catch (err) {
    res.status(401).json({ msg: 'Toekn Is Not Valid' })
  }
}
