const { Laundry, UserProfile } = require('../models/index')

class LaundryController {
  static async getAll(_, res) {
    const laundries = await Laundry.findAll({
      include: {
        model: UserProfile,
        as: 'owner'
      }
    })
    res.status(200).json(laundries)
  }

  static async create(req, res, next) {
    try {
      const { id } = req.user
      const { name, location, latitude, longitude, image } = req.body

      const laundry = await Laundry.create({
        name,
        location,
        latitude,
        longitude,
        image,
        ownerId: id
      })

      res.status(201).json({
        id: laundry.id,
        name: laundry.name,
        location: laundry.location,
        latitude: laundry.latitude,
        longitude: laundry.longitude,
        image: laundry.image
      })
    } catch (error) {
      next(error)
    }
  }

  static async update(req, res, next) {
    try {
      console.log(req.body)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = LaundryController