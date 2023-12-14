const express = require('express')
const router = express.Router()

const ProductController = require('../controllers/product')
const { authorization, authLaundry } = require('../middlewares/auth')

router.get('/:laundryId/products', ProductController.getAll)
router.post('/:laundryId/products', authorization, authLaundry, ProductController.create)
router.put('/:laundryId/products/:productId', authorization, authLaundry, ProductController.update)
router.delete('/:laundryId/products/:productId', authorization, authLaundry, ProductController.delete)

module.exports = router