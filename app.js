const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const dotenv = require('dotenv')
const cors = require('cors');

dotenv.config()

const app = express()

app.use(logger('dev'))
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/api/user', require('./routes/users'));

module.exports = app
