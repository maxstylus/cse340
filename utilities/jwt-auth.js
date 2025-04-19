const jwt = require('jsonwebtoken')
require('dotenv').config()

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET


function generateToken(userData) {
  return jwt.sign(userData, accessTokenSecret, { expiresIn: 3600 * 1000 })
}

function verifyToken(req, res, next) {
  console.log("Verifying token...") // Debug log
  console.log("All cookies:", req.cookies) // Debug log

  const token = req.cookies.jwt
  
  // Set default state
  res.locals.loggedin = false
  res.locals.accountData = null

  if (token) {
    try {
      const decoded = jwt.verify(token, accessTokenSecret)
      res.locals.loggedin = true
      res.locals.accountData = decoded
      console.log("Token verified for:", decoded.account_firstname) // Debug log
    } catch (err) {
      console.log("Token verification failed:", err.message) // Debug log
      res.clearCookie('jwt')
    }
  } else {
    console.log("No JWT cookie found in:", Object.keys(req.cookies)) // Debug log
  }
  next()
}

module.exports = { generateToken, verifyToken }