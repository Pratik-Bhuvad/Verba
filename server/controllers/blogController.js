const Blog = require('../models/Blog')
const { validationResult } = require('express-validator')
const dataExists = require('../utils/DataExists')
const mongoose = require('mongoose')
const User = require('../models/user')
const { HTTP_STATUS, ERROR_CODES } = require('../utils/errorConstants')
const { logError, logInfo } = require('../utils/logger')

const createBlog = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const error_messages = errors.array().map(err => err.msg)
        logError({ message: error_messages.join(', '), code: ERROR_CODES.INVALID_REQUEST }, 'createBlog')
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            data: error_messages,
            message: 'Invalid Request Arguments',
            errorCode: ERROR_CODES.INVALID_REQUEST
        })
    }
    try {
        const { title, content } = req.body
        const blogExists = await dataExists({ title, id: req.user.id }, Blog)
        if (blogExists.exists) {
            logError({
                message: `Blog with title already exists`,
                code: ERROR_CODES.BLOG_EXISTS
            }, 'createBlog', { title, userId: req.user.id })
            return res.status(HTTP_STATUS.CONFLICT).json({
                success: false,
                data: title,
                message: `Blog with Title: ${title} is already created by You`,
                errorCode: ERROR_CODES.BLOG_EXISTS
            })
        }
        const newBlog = await new Blog({
            title,
            content,
            author: req.user.id
        })
        await newBlog.save()
        logInfo('Blog created successfully', { blogId: newBlog._id, userId: req.user.id })
        return res.status(HTTP_STATUS.CREATED).json({
            success: true,
            data: newBlog,
            message: 'Blog created successfully'
        })
    } catch (error) {
        logError(error, 'createBlog', { title, userId: req.user.id })
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            data: {},
            message: 'Internal Server Error',
            errorCode: ERROR_CODES.DATABASE_ERROR
        })
    }
}

const updateBlog = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const error_messages = errors.array().map(err => err.msg)
        logError({ message: error_messages.join(', '), code: ERROR_CODES.INVALID_REQUEST }, 'updateBlog')
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            data: error_messages,
            message: 'Invalid Request Arguments',
            errorCode: ERROR_CODES.INVALID_REQUEST
        })
    }
    try {
        const { title, content } = req.body
        const id = req.params.id

        if (!mongoose.Types.ObjectId.isValid(id)) {
            logError({ message: 'Invalid blog ID', code: ERROR_CODES.INVALID_BLOG_ID }, 'updateBlog', { id })
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: 'Invalid Blog ID',
                errorCode: ERROR_CODES.INVALID_BLOG_ID
            });
        }

        const blogExists = await Blog.findById(id)
        if (!blogExists) {
            logError({ message: 'Blog not found', code: ERROR_CODES.BLOG_NOT_FOUND }, 'updateBlog', { id })
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: 'Blog not found',
                errorCode: ERROR_CODES.BLOG_NOT_FOUND
            })
        }

        if (blogExists.author.toString() !== req.user.id.toString()) {
            logError({ message: 'Unauthorized blog access', code: ERROR_CODES.UNAUTHORIZED_BLOG_ACCESS }, 'updateBlog', { blogId: id, userId: req.user.id })
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                message: 'Unauthorized access to blog',
                errorCode: ERROR_CODES.UNAUTHORIZED_BLOG_ACCESS
            });
        }
        title && (blogExists.title = title)
        content && (blogExists.content = content)
        await blogExists.save()
        logInfo('Blog updated successfully', { blogId: id, userId: req.user.id })
        return res.status(HTTP_STATUS.OK).json({
            success: true,
            data: blogExists,
            message: 'Blog Updated Successfully'
        })
    } catch (error) {
        logError(error, 'updateBlog', { blogId: req.params.id, userId: req.user.id })
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            data: {},
            message: 'Internal Server Error',
            errorCode: ERROR_CODES.DATABASE_ERROR
        })
    }
}

const deleteBlog = async (req, res) => {
    try {
        const id = req.params.id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            logError({ message: 'Invalid blog ID', code: ERROR_CODES.INVALID_BLOG_ID }, 'deleteBlog', { id })
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: 'Invalid Blog ID',
                errorCode: ERROR_CODES.INVALID_BLOG_ID
            });
        }

        const blogExists = await Blog.findById(id)
        if (!blogExists) {
            logError({ message: 'Blog not found', code: ERROR_CODES.BLOG_NOT_FOUND }, 'deleteBlog', { id })
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: 'Blog not found',
                errorCode: ERROR_CODES.BLOG_NOT_FOUND
            })
        }

        if (blogExists.author.toString() !== req.user.id.toString()) {
            logError({ message: 'Unauthorized blog access', code: ERROR_CODES.UNAUTHORIZED_BLOG_ACCESS }, 'deleteBlog', { blogId: id, userId: req.user.id })
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                message: 'Unauthorized access to blog',
                errorCode: ERROR_CODES.UNAUTHORIZED_BLOG_ACCESS
            })
        }

        await blogExists.deleteOne()
        logInfo('Blog deleted successfully', { blogId: id, userId: req.user.id })
        return res.status(HTTP_STATUS.OK).json({
            success: true,
            data: {},
            message: 'Blog Deleted Successfully'
        })
    } catch (error) {
        logError(error, 'deleteBlog', { blogId: req.params.id, userId: req.user.id })
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            data: {},
            message: 'Internal Server Error',
            errorCode: ERROR_CODES.DATABASE_ERROR
        })
    }
}

const retrieveBlogs = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = req.query
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { [sort]: order === 'asc' ? 1 : -1 },
        }

        const blogs = await Blog.paginate({}, options)
        if (!blogs.docs.length) {
            logError({ message: 'No blogs found', code: ERROR_CODES.BLOG_NOT_FOUND }, 'retrieveBlogs')
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: 'No Blogs found',
                errorCode: ERROR_CODES.BLOG_NOT_FOUND
            })
        }

        logInfo('Blogs retrieved successfully', {
            totalBlogs: blogs.totalDocs,
            page: blogs.page
        })
        return res.status(HTTP_STATUS.OK).json({
            success: true,
            data: {
                totalBlogs: blogs.totalDocs,
                totalpages: blogs.totalPages,
                currentPage: blogs.page,
                blogs: blogs.docs
            },
            message: 'Blogs Retrieved Successfully'
        })
    } catch (error) {
        logError(error, 'retrieveBlogs', { page, limit, sort, order: req.query })
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            data: {},
            message: 'Internal Server Error',
            errorCode: ERROR_CODES.DATABASE_ERROR
        })
    }
}

const singleRetrieveBlog = async (req, res) => {
    try {
        const id = req.params.id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            logError({ message: 'Invalid blog ID', code: ERROR_CODES.INVALID_BLOG_ID }, 'singleRetrieveBlog', { id })
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: 'Invalid Blog ID',
                errorCode: ERROR_CODES.INVALID_BLOG_ID
            });
        }

        const blogExists = await Blog.findById(id)
        if (!blogExists) {
            logError({ message: 'Blog not found', code: ERROR_CODES.BLOG_NOT_FOUND }, 'singleRetrieveBlog', { id })
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: 'Blog not found',
                errorCode: ERROR_CODES.BLOG_NOT_FOUND
            })
        }

        logInfo('Blog retrieved successfully', { blogId: id })
        return res.status(HTTP_STATUS.OK).json({
            success: true,
            data: blogExists,
            message: 'Blog Retrieved Successfully'
        })
    } catch (error) {
        logError(error, 'singleRetrieveBlog', { blogId: req.params.id })
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            data: {},
            message: 'Internal Server Error',
            errorCode: ERROR_CODES.DATABASE_ERROR
        })
    }
}

const getblogsBy = async (req, res) => {
    try {
        const { search } = req.query
        if (!search || search === null || search === undefined || search === '') {
            logError({ message: 'Invalid search query', code: ERROR_CODES.INVALID_REQUEST }, 'getblogsBy')
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: 'Search query is required',
                errorCode: ERROR_CODES.INVALID_REQUEST
            })
        }

        const blogsArray = await Blog.find({
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ]
        })

        if (!blogsArray || blogsArray.length === 0) {
            logError({ message: 'No blogs found matching search criteria', code: ERROR_CODES.BLOG_NOT_FOUND }, 'getblogsBy', { search })
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: 'No blogs found matching your search',
                errorCode: ERROR_CODES.BLOG_NOT_FOUND
            })
        }

        const blogsWithUsers = await Promise.all(
            blogsArray.map(async (blog) => {
                const user = await User.findById(blog.author)
                return {
                    ...blog.toObject(),
                    authorDetails: {
                        username: user.username,
                        email: user.email
                    }
                }
            })
        )

        logInfo('Blogs retrieved successfully by search', {
            searchQuery: search,
            blogsFound: blogsArray.length
        })
        return res.status(HTTP_STATUS.OK).json({
            success: true,
            data: blogsWithUsers,
            message: 'Blogs retrieved successfully'
        })
    } catch (error) {
        logError(error, 'getblogsBy', { searchQuery: req.query.search })
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            data: {},
            message: 'Internal Server Error',
            errorCode: ERROR_CODES.DATABASE_ERROR
        })
    }
}

module.exports = {
    createBlog,
    updateBlog,
    deleteBlog,
    retrieveBlogs,
    singleRetrieveBlog,
    getblogsBy
}