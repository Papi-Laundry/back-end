const express = require('express')
const router = express.Router()

const User = require('../controllers/user')
const { authorization } = require('../middlewares/auth')

router.post('/login', User.login)
router.post('/register', User.register)
router.put('/profiles', authorization, User.update)

module.exports = router