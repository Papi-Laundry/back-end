const { Order, UserProfile, Product, Laundry } = require('../models/index')

class OrderController {
  static async create(req, res, next) {
    try {
      const { productId } = req.params
      if(!Number(productId)) throw { name: "NotFound" }

      const { id } = req.user
      const { totalUnit, notes, method, destination, status } = req.body

      const queryCreate = {
        productId,
        clientId: id,
        totalUnit,
        notes,
        method,
        destination,
        status
      }

      if(req.body.coordinates) {
        const coordinates = JSON.parse(req.body.coordinates)
        latitude = coordinates.latitude
        longitude = coordinates.longitude
        const destinationPoint = {
          type: 'Point',
          coordinates: [latitude, longitude]
        }

        queryCreate.destinationPoint = destinationPoint
      }

      const order = await Order.create(queryCreate)

      res.status(201).json({
        id: order.id,
        productId: order.productId,
        clientId: order.clientId,
        totalUnit: order.totalUnit,
        notes: order.notes,
        method: order.method,
        destination: order.destination,
        status: order.status,
        destinationPoint: order.destinationPoint,
        createdAt: order.createdAt
      })
    } catch (error) {
      next(error)
    }
  }

  static async getMy(req, res, next) {
    try {
      const { id } = req.user
      const orders = await Order.findAll({
        where: {
          clientId: id
        },
        include: [
          {
            model: UserProfile,
          },
          {
            model: Product,
            include: {
              model: Laundry
            }
          }
        ]
      })

      res.status(200).json(orders)
    } catch (error) {
      next(error)
    }
  }

  static async get(req, res, next) {
    try {
      const { productId } = req.params
      if(!Number(productId)) throw { name: "NotFound" }
      const orders = await Order.findAll({
        where: {
          productId
        },
        include: [
          {
            model: UserProfile,
          },
          {
            model: Product,
            include: {
              model: Laundry
            }
          }
        ]
      })

      res.status(200).json(orders)
    } catch (error) {
      next(error)
    }
  }

  static async update(req, res, next) {
    try {
      const { productId, orderId } = req.params
      if(!Number(productId)) throw { name: "NotFound" }
      if(!Number(orderId)) throw { name: "NotFound" }

      const { rating, status } = req.body
      let order = await Order.findByPk(orderId)
      if(!order) throw { name: "NotFound" }

      await Order.update({
        rating,
        status
      }, {
        where: {
          id: orderId
        }
      })

      order = await Order.findByPk(orderId)

      res.status(200).json({
        id: order.id,
        productId: order.productId,
        clientId: order.clientId,
        totalUnit: order.totalUnit,
        notes: order.notes,
        method: order.method,
        destination: order.destination,
        status: order.status,
        destinationPoint: order.destinationPoint,
        updatedAt: order.updatedAt
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = OrderController