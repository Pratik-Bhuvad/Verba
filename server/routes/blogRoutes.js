const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const { blogValidation } = require('../validators/blogValidators')
const { createBlog, updateBlog, deleteBlog, retrieveBlogs, singleRetrieveBlog } = require('../controllers/blogController')
const router = express.Router()

router.use(authMiddleware)

router.post('/', blogValidation, createBlog)
router.put('/:id', blogValidation, updateBlog)
router.delete('/:id', deleteBlog)
router.get('/', retrieveBlogs)
router.get('/:id', singleRetrieveBlog)

module.exports = router