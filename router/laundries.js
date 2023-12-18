const express = require('express')
const multer = require('multer');

const router = express.Router()
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const LaundryController = require('../controllers/laundry')
const { authorization, authOwner, authLaundry } = require('../middlewares/auth')
const products = require('./products')

router.get('/', LaundryController.getAll)
router.post('/', authorization, authOwner, upload.single('picture'), LaundryController.create)
router.get('/:laundryId', LaundryController.get)
router.put('/:laundryId', authorization, authLaundry, LaundryController.update)
router.delete('/:laundryId', authorization, authLaundry, LaundryController.delete)
router.use('/', products)

module.exports = router