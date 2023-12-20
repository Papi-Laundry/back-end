if(process.env.NODE_ENV !== "production") {
  require('dotenv').config()
}

const { Transaction, UserProfile } = require('../models/index')
const midtransClient = require('midtrans-client')

class TransactionController {
  static async create(req, res, next) {
    try {
      const { id } = req.user
      const { price } = req.body
      if(!Number(price)) throw { name: "InvalidTransaction" }

      let snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY
      })

      const orderId = new Date().getTime()
      const paramater = {
        "transaction_details": {
          "order_id": 'PL-' + orderId,
          "gross_amount": price
        }
      }

      snap.createTransaction(paramater)
        .then(async (transaction) => {
          await Transaction.create({
            orderId: 'PL-' + orderId,
            price: Number(price),
            userId: id
          })

          res.status(200).json(transaction)
        })
    } catch (error) {
      next(error)
    }
  }

  static async listen(req, res, next) {
    try {
      const { transaction_status, order_id } = req.body
      const transaction = await Transaction.update({
        status: transaction_status
      }, {
        where: {
          orderId: order_id
        },
        returning: true
      })

      if(transaction_status === "settlement") {
        const profiles = await UserProfile.findOne({
          where: {
            userId: transaction[1][0].dataValues.userId
          }
        })

        await UserProfile.update({
          balance: profiles.balance + transaction[1][0].dataValues.price
        }, {
          where: {
            id: profiles.id
          }
        })
      }

      res.sendStatus(200)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = TransactionController