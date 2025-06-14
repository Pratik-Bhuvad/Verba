const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit')

const appLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: 'Too many request, try again later'
})

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(morgan('dev'))
app.use(helmet())
app.use(cookieParser())

app.use(appLimit)

const authRoutes = require('./routes/authRoutes')
app.use('/api/auth', authRoutes)

const blogRoutes = require('./routes/blogRoutes')
app.use('/api/blog', blogRoutes)

const userRoutes = require('./routes/userRoutes')
app.use('/api/users', userRoutes)

app.get('/', (req, res) => {
    res.status(200).json({ success: true, data: {}, message: 'Server Working' })
})

app.use((err, req, res) => {
    console.log(err.stack);
    return res.status(500).json({ success: false, message: 'Server Error' })
})

module.exports = app