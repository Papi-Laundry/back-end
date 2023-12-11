const { UserProfile } = require('../models/index')

class User {
  static async register(req, res, next) {
    try {
      res.send({
        message: "Register"
      })
    } catch (error) {
      next(error)
    }
  }

  static async login(req, res, next) {
    try {
      res.send({
        message: "Login"
      })
    } catch (error) {
      next(error)
    }
  }

  static async update(req, res, next) {
    try {
      const { name, image } = req.body
      const { id } = req.user

      await UserProfile.update({
        name, image
      }, {
        where: {
          userId: id
        }
      })
      
      const profile = await UserProfile.findOne({
        where: {
          userId: id
        }
      })
      if(!profile) throw { name: "NotFound" }
      
      res.status(200).json({
        id: profile.id,
        name: profile.name,
        image: profile.image,
        updatedAt: profile.updatedAt
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = User