const { verifyToken } = require("../helpers/jwt")
const { User } = require('../models/index')

async function authorization(req, res, next) {
  try {
    const headers = req.headers.authorization
    if(!headers) throw { name: "InvalidToken" }

    const access_token = headers.split(' ')
    if(access_token.length !== 2) throw { name: 'InvalidToken' }
    if(access_token[0] !== "Bearer" || !access_token[1]) throw { name: 'InvalidToken' }

    const token = verifyToken(access_token[1])
    if(!token.id && token.id !== 0) throw { name: 'InvalidToken' }

    const user = await User.findByPk(token.id)
    if(!user) throw { name: 'InvalidToken' }

    req.user = {
      id: user.id
    }
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  authorization
}