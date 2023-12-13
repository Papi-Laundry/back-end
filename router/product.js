const express = require('express')
const router = express.Router()

const ProductController = require('../controllers/product')
const { authorization, authLaundry } = require('../middlewares/auth')

router.post('/laundries/:laundryId/products',authorization, authLaundry, ProductController.createProduct)
router.put('/laundries/:laundryId/products/:productId', authorization, authLaundry, ProductController.updateProduct)
router.delete('/:laundryId/laundries/:laundryId/products/:productId', authorization, authLaundry, ProductController.deleteProduct)



module.exports = router