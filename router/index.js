const express = require('express')
const router = express.Router()

const user = require('./users')
const laundries = require('./laundries')
const categories = require('./categories')
const transactions = require('./transaction')

router.use(user)
router.use('/laundries', laundries)
router.use('/categories', categories)
router.use('/transactions', transactions)

module.exports = router