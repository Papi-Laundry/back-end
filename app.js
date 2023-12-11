const express = require('express')
const app = express()
const cors = require('cors')

const index = require('./router/index')
const error = require('./middlewares/error')

app.use(cors())
app.use(express.json());
app.use(index)
app.use(error)

module.exports = app