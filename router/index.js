const express = require('express')
const router = express.Router()

const user = require('./users')
const laundries = require('./laundries')

router.use(user)
router.use('/laundries', laundries)

module.exports = router