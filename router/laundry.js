const express = require('express')
const router = express.Router()

const LaundryController = require('../controllers/laundry')
const { authorization, authOwner, authLaundry } = require('../middlewares/auth')

router.get('/', LaundryController.getAll)
router.post('/', authorization, authOwner, LaundryController.create)
router.put('/:laundryId', authorization, authOwner, authLaundry, LaundryController.update)

module.exports = router