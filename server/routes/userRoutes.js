const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const { PorfileUpdation } = require('../validators/profileUpdation')
const { getMyProfile, getMyBlogs, getUser, updateProfile, deleteAccount,getUserDetails } = require('../controllers/userController')
const router = express.Router()

router.use(authMiddleware)
router.get('/me', getMyProfile)
router.get('/myblogs', getMyBlogs)
router.get('/user', getUserDetails)
router.get('/:id', getUser)
router.put('/me', PorfileUpdation, updateProfile)
router.delete('/me', deleteAccount)

module.exports = router