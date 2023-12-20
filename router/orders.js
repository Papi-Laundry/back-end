const express = require('express')
const router = express.Router()

const OrderController = require('../controllers/order')
const { authorization } = require('../middlewares/auth')

router.get('/my', authorization, OrderController.getMy)
router.post('/:productId', authorization, OrderController.create)
router.get('/:laundryId', OrderController.get)
router.put('/:productId/:orderId', authorization, OrderController.update)

module.exports = router