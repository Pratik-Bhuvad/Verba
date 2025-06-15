const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const { blogValidation } = require('../validators/blogValidators')
const { createBlog, updateBlog, deleteBlog, retrieveBlogs, singleRetrieveBlog, getblogsBy } = require('../controllers/blogController')
const { blogCreationLimiter, apiLimiter } = require('../middleware/rateLimiting')
const router = express.Router()

router.post('/', authMiddleware, blogCreationLimiter, blogValidation, createBlog)
router.put('/:id', authMiddleware, blogValidation, updateBlog)
router.delete('/:id', authMiddleware, deleteBlog)
router.get('/', apiLimiter,retrieveBlogs)
router.get('/blogs', apiLimiter, getblogsBy)
router.get('/:id', apiLimiter, singleRetrieveBlog)

module.exports = router