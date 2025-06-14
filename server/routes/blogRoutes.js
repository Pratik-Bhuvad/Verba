const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const { blogValidation } = require('../validators/blogValidators')
const { createBlog, updateBlog, deleteBlog, retrieveBlogs, singleRetrieveBlog, getblogsBy } = require('../controllers/blogController')
const router = express.Router()



router.post('/', authMiddleware, blogValidation, createBlog)
router.put('/:id', authMiddleware, blogValidation, updateBlog)
router.delete('/:id', authMiddleware, deleteBlog)
router.get('/', retrieveBlogs)
router.get('/blogs', getblogsBy)
router.get('/:id', singleRetrieveBlog)

module.exports = router