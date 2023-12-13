const { verifyToken } = require("../helpers/jwt")
const { User, Laundry } = require('../models/index')

async function authorization(req, _, next) {
  try {
    const headers = req.headers.authorization
    if(!headers) throw { name: "InvalidToken" }

    const access_token = headers.split(' ')
    if(access_token.length !== 2) throw { name: 'InvalidToken' }
    if(access_token[0] !== "Bearer" || !access_token[1]) throw { name: 'InvalidToken' }

    const token = verifyToken(access_token[1])
    if(!token.id) throw { name: 'InvalidToken' }

    const user = await User.findByPk(token.id)
    if(!user) throw { name: 'InvalidToken' }

    req.user = {
      id: user.id,
      role: user.role
    }
    next()
  } catch (error) {
    next(error)
  }
}

function authOwner(req, _, next) {
  try {
    const { role } = req.user
    if(role !== "owner") throw { name: "Forbidden" }

    next()
  } catch (error) {
    next(error)
  }
}

async function authLaundry(req, _, next) {
  try {
    const { id } = req.user
    const { laundryId } = req.params
    if(!Number(laundryId)) throw { name: "InvalidParams" }

    const laundry = await Laundry.findOne({
      where: {
        id: Number(laundryId)
      }
    })
    if(!laundry) throw { name: "NotFound" }

    if(laundry.ownerId !== id) throw { name: "Forbidden" }
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  authorization,
  authOwner,
  authLaundry
}