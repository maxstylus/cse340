const jsonwebtoken = require('jsonwebtoken')
require('dotenv').config()
const jwt = require('./jwt-auth')

const testData = {
  account_firstname: "Test",
  account_type: "Client",
  account_id: 1
}

// Generate token using our utility
const token = jwt.generateToken(testData)
console.log("Test token generated:", token)

try {
  // Use jsonwebtoken directly for verification
  const decoded = jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_SECRET)
  console.log("Token verified:", decoded)
} catch (err) {
  console.error("Token verification failed:", err)
}