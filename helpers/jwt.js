require('dotenv').config()
const jwt = require('jsonwebtoken')

function createToken(idInput) {
  return jwt.sign(idInput, process.env.JWT_SECRET)
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET)
}

module.exports = {
  createToken,
  verifyToken
}