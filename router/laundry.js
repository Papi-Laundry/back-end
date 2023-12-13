const express = require('express')
const router = express.Router()

const LaundryController = require('../controllers/laundry')
const { authorization, authOwner, authLaundry } = require('../middlewares/auth')

router.get('/', LaundryController.getAll)
router.post('/', authorization, authOwner, LaundryController.create)
router.get('/:laundryId', LaundryController.get)
router.put('/:laundryId', authorization, authLaundry, LaundryController.update)
router.delete('/:laundryId', authorization, authLaundry, LaundryController.delete)

module.exports = router