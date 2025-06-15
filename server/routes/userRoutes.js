const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const { PorfileUpdation } = require('../validators/profileUpdation')
const { getMyProfile, getMyBlogs, getUser, updateProfile, deleteAccount,getUserDetails } = require('../controllers/userController')
const { apiLimiter } = require('../middleware/rateLimiting')
const router = express.Router()

router.use(authMiddleware)
router.get('/me', apiLimiter, getMyProfile)
router.get('/myblogs', apiLimiter, getMyBlogs)
router.get('/user', apiLimiter, getUserDetails)
router.get('/:id', apiLimiter, getUser)
router.put('/me', PorfileUpdation, updateProfile)
router.delete('/me', deleteAccount)

module.exports = router