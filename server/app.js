const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
const securityMiddleware = require('./middleware/security')

const appLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many request, try again later'
})

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:5173',
            'http://localhost:5174',
            // Add your production domain
        ];

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
};

app.use(cors(corsOptions));
app.use(morgan('dev'))
app.use(securityMiddleware)
app.use(cookieParser())

app.use((req, res, next) => {
    if (req.body) mongoSanitize.sanitize(req.body);
    if (req.params) mongoSanitize.sanitize(req.params);
    next();
});

app.use(appLimit)

const authRoutes = require('./routes/authRoutes')
app.use('/api/auth', authRoutes)

const blogRoutes = require('./routes/blogRoutes')
app.use('/api/blogs', blogRoutes)

const userRoutes = require('./routes/userRoutes')
app.use('/api/users', userRoutes)

app.get('/', (req, res) => {
    res.status(200).json({ success: true, data: {}, message: 'Server Working' })
})

app.use((err, req, res, next) => {
    console.log(err.stack);
    return res.status(500).json({ success: false, message: 'Server Error' })
})

module.exports = app