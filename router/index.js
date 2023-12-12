const express = require('express')
const router = express.Router()

const user = require('./user')
const laundry = require('./laundry')

router.use(user)
router.use('/laundries', laundry)

module.exports = router