const express = require('express')
const router = express.Router()
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({storage})
  

const LaundryController = require('../controllers/laundry')
const { authorization, authOwner, authLaundry } = require('../middlewares/auth')
const products = require('./products')

router.get('/', LaundryController.getAll)
router.post('/', authorization, authOwner,  upload.single('laundryPicture'), LaundryController.create)
router.get('/my', authorization, authOwner, LaundryController.getMy)
router.get('/:laundryId', LaundryController.get)
router.put('/:laundryId', authorization, authLaundry, LaundryController.update)
router.delete('/:laundryId', authorization, authLaundry, LaundryController.delete)
router.use('/', products)

module.exports = router