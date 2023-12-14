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

  static async get(req, res, next) {
    try {
      const { laundryId } = req.params
      if(!Number(laundryId)) throw { name: "InvalidParams" }
      
      const laundry = await Laundry.findOne({
        where: {
          id: laundryId
        },
        include: {
          model: UserProfile,
          as: 'owner'
        }
      })
      if(!laundry) throw { name: "NotFound" }

      res.status(200).json(laundry)
    } catch (error) {
      next(error)
    }
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
        image: laundry.image,
        createdAt: laundry.createdAt
      })
    } catch (error) {
      next(error)
    }
  }

  static async update(req, res, next) {
    try {
      const { laundryId } = req.params
      const { name, location, latitude, longitude, image } = req.body
  
      await Laundry.update({
        name,
        location,
        latitude,
        longitude,
        image
      }, {
        where: {
          id: laundryId
        }
      })
  
      const laundry = await Laundry.findByPk(laundryId)
  
      res.status(200).json({
        id: laundry.id,
        name: laundry.name,
        location: laundry.location,
        latitude: laundry.latitude,
        longitude: laundry.longitude,
        image: laundry.image,
        updatedAt: laundry.updatedAt
      })
    } catch (error) {
      next(error)
    }
  }

  static async delete(req, res) {
    const { laundryId } = req.params

    const laundry = await Laundry.findByPk(laundryId)

    await Laundry.destroy({
      where: {
        id: laundryId
      }
    })

    res.status(200).json({
      id: laundry.id,
      name: laundry.name,
      location: laundry.location,
      latitude: laundry.latitude,
      longitude: laundry.longitude,
      image: laundry.image
    })
  }
}

module.exports = LaundryController