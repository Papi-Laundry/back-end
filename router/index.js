const express = require('express')
const router = express.Router()

const user = require('./users')
const laundries = require('./laundries')
const categories = require('./categories')

router.use(user)
router.use('/laundries', laundries)
router.use('/categories', categories)

module.exports = router