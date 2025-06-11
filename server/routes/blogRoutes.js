const express = require('express')
const authMiddleware  = require('../middleware/authMiddleware')
const { blogValidation } = require('../validators/blogValidators')
const { createBlog } = require('../controllers/blogController')
const router  = express.Router()

router.use(authMiddleware)

router.post('/', blogValidation, createBlog) 

module.exports = router