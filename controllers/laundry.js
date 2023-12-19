const { Laundry, UserProfile, Product, Category } = require('../models/index')
const { sequelize } = require('../models')
const { Op } = require('sequelize');
const cloudinary = require('cloudinary')

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
})

class LaundryController {
  static async getMy(req, res, next) {
    try {
      const { id } = req.user

      const laundries = await Laundry.findAll({
        where: {
          ownerId: id
        }
      })

      res.status(200).json(laundries)
    } catch (error) {
      next(error)
    }
  }

  static async getAll(req, res, next) {
    try {
      const { longitude, latitude, categoryId, location } = req.query
      
      let laundries
      if(!latitude && !longitude) {
        const query = {
          include: [
            {
              model: Laundry,
              as: 'laundry',
              include: {
                model: UserProfile,
                as: 'owner'
              }
            },
            {
              model: Category,
              as: 'category'
            }
          ],
          order: [
            ["createdAt", "DESC"]
          ]
        }

        if(categoryId) query.where = {
          categoryId
        }

        if(location) query.include[0].where = {
          location: {
            [Op.iLike] : `%${location}%`
          }
        }

        laundries = await Product.findAll(query)
      } else if(latitude && longitude) {
        if(!Number(latitude) || !Number(longitude)) {
          throw { name: "InvalidCoord" }
        }

        laundries = await sequelize.query(
          `select
            "l".id,
            "l".name,
            "l".location,
            "l"."locationPoint",
            "l".image,
            "l"."ownerId",
            "l"."createdAt",
            "l"."updatedAt",
            "up".id as "owner.id",
            "up".name as "owner.name",
            "up".image as "owner.image",
            "up"."userId" as "owner.userId",
            "up"."createdAt" as "owner.createdAt",
            "up"."updatedAt" as "owner.updatedAt"
          from
            "Laundries" as "l"
          inner join
            "UserProfiles" as "up"
          on
            "l"."ownerId" = "up".id
          where
            ST_DWithin("locationPoint",
            ST_MakePoint(:lat, :long), 5000, true) = true
          order by
            "l"."createdAt" DESC;`,
            {
              replacements: {
                long: parseFloat(longitude),
                lat: parseFloat(latitude)
              },
              logging: false,
              plain: false,
              raw: false,
              type: sequelize.QueryTypes.SELECT,
              nest: true
            }
        )
      } else {
        throw { name: "InvalidCoord" }
      }
  
      res.status(200).json(laundries)
    } catch (error) {
      next(error)
    }
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
      const name = req.body.laundryName;
      const coordinates = JSON.parse(req.body.coordinates);
      let latitudeStr = coordinates.latitude.toString();
      let longitudeStr = coordinates.longitude.toString();

      console.log(name, coordinates, "horyaah");
      const { id } = req.user
      const location = "hardcode masih"
      const file = "data:" + req.file.mimetype + ";base64," + req.file.buffer.toString("base64")
      const response = await cloudinary.v2.uploader.upload(file, {public_id: req.file.originalname})
      console.log(id, name, coordinates.latitude, coordinates.longitude, response.url);
      const image = response.url

      // if(!Number(latitude) || !Number(longitude)) {
      //   throw { name: "SequelizeLocation" }
      // }

      const locationPoint = {
        type: 'Point',
        coordinates: [latitudeStr, longitudeStr]
      }
      console.log(locationPoint);

      const laundry = await Laundry.create({
        name,
        location,
        locationPoint,
        image,
        ownerId: id
      })
      console.log(laundry);

      res.status(201).json({
        id: laundry.id,
        name: laundry.name,
        location: laundry.location,
        latitude: laundry.locationPoint.coordinates[0],
        longitude: laundry.locationPoint.coordinates[1],
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

      let locationPoint
      if(latitude || longitude) {
        if(!Number(latitude) || !Number(longitude)) {
          throw { name: "SequelizeLocation" }
        }
        locationPoint = {
          type: 'Point',
          coordinates: [latitude, longitude]
        }
      }

      await Laundry.update({
        name,
        location,
        locationPoint,
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
        latitude: laundry.locationPoint.coordinates[0],
        longitude: laundry.locationPoint.coordinates[1],
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
      latitude: laundry.locationPoint.coordinates[0],
      longitude: laundry.locationPoint.coordinates[1],
      image: laundry.image
    })
  }
}

module.exports = LaundryController