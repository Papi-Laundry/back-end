const express = require('express')
const router = express.Router()
const controllerUser = require('../controllers/user')

const { authorization } = require('../middlewares/auth')

router.post('/login', controllerUser.login)
router.post('/register', controllerUser.register)
router.put('/profiles', authorization, controllerUser.update)

module.exports = router