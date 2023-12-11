const express = require('express')
const router = express.Router()

const user = require('./user')

router.use(user)
router.get('/', (req, res) => {
  res.send({
    message: "Oke"
  })
})

module.exports = router