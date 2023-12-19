const express = require('express')
const router = express.Router()

const TransactionController = require('../controllers/transaction')
const { authorization } = require('../middlewares/auth')

router.post('/', authorization, TransactionController.create)
router.post('/listen', TransactionController.listen)

module.exports = router