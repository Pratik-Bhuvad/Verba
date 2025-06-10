const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(morgan('dev'))
app.use(helmet())
app.use(cookieParser())

const authRoutes = require('./routes/authRoutes')
app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
    res.status(200).json({ success: true, data: {}, message: 'Server Working' })
})

app.use((err, req, res) => {
    console.log(err.stack);
    return res.status(500).json({ success: false, message: 'Server Error' })
})

module.exports = app