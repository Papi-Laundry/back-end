const express = require('express')
const router = express.Router()
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({storage})

const UserController = require('../controllers/user')
const { authorization } = require('../middlewares/auth')

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/profiles', authorization, UserController.get)
router.put('/profiles', authorization, upload.single('laundryPicture'), UserController.update)


module.exports = router