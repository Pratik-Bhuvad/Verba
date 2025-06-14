const express = require('express')
const rateLimit = require('express-rate-limit')
const { RegisterValidations, LoginValidations } = require('../validators/authValidators')
const { RegisterUser, Login, Logout } = require('../controllers/authController')
const authMiddleware = require('../middleware/authMiddleware')
const router = express.Router()

const authLimiter = rateLimit({
    max: 25,
    windowMs: 10 * 60 * 1000,
    message: 'Too many request, try again later'
})

router.use(authLimiter)

router.post('/register', RegisterValidations, RegisterUser)
router.post('/login', LoginValidations, Login)
router.post('/logout', authMiddleware, Logout)

module.exports = router