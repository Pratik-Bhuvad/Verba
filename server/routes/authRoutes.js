const express = require('express')
const rateLimit = require('express-rate-limit')
const { RegisterValidations, LoginValidations } = require('../validators/authValidators')
const { RegisterUser, Login, Logout } = require('../controllers/authController')
const authMiddleware = require('../middleware/authMiddleware')
const router = express.Router()

const {authLimiter} = require('../middleware/rateLimiting')

router.use(authLimiter)

router.post('/register', RegisterValidations, RegisterUser)
router.post('/login', LoginValidations, Login)
router.post('/logout', authMiddleware, Logout)

module.exports = router