const express = require('express')
const router = express.Router()

const user = require('./users')
const laundries = require('./laundries')
const categories = require('./categories')
const transactions = require('./transaction')
const orders = require('./orders')

router.use(user)
router.use('/laundries', laundries)
router.use('/categories', categories)
router.use('/transactions', transactions)
router.use('/orders', orders)

module.exports = router