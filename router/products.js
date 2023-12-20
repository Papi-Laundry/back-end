const express = require('express')
const router = express.Router()

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const ProductController = require('../controllers/product')
const { authorization, authLaundry } = require('../middlewares/auth')

router.get('/:laundryId/products', ProductController.getAll)
router.post('/:laundryId/products', authorization, authLaundry, upload.single('picture'), ProductController.create)
router.put('/:laundryId/products/:productId', authorization, authLaundry, upload.single('picture'), ProductController.update)
router.delete('/:laundryId/products/:productId', authorization, authLaundry, ProductController.delete)

module.exports = router