const Blog = require('../models/Blog')
const { validationResult } = require('express-validator')
const dataExists = require('../utils/DataExists')
const mongoose = require('mongoose')

const createBlog = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const error_messages = errors.array().map(err => err.msg)
        console.log(('Issue in Request:- ', error_messages));
        return res.status(400).json({ success: false, data: error_messages, message: 'Invalid Request Arguments' })
    }
    try {
        const { title, content } = req.body

        const blogExists = await dataExists({ title, id: req.user.id }, Blog)
        if (blogExists) return res.status(409).json({ success: false, data: blogExists.title, message: `Blog with Title: ${blogExists.title} is already created by You` })
        const newBlog = await Blog({
            title,
            content,
            author: req.user.id
        })

        await newBlog.save()

        return res.status(201).json({ success: true, data: newBlog, message: 'Blog created successfully' })
    } catch (error) {
        console.log("Creating new Blog Issue ", error.message);
        return res.status(500).json({ success: false, data: {}, message: 'Server Error' })
    }
}

const updateBlog = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const error_messages = errors.array().map(err => err.msg)
        console.log(('Issue in Request:- ', error_messages));
        return res.status(400).json({ success: false, data: error_messages, message: 'Invalid Request Arguments' })
    }
    try {
        const { title, content } = req.body
        const id = req.params.id

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'Invalid Blog ID' });

        const blogExists = await Blog.findById(id)
        if (!blogExists) return res.status(404).json({ success: false, message: 'Blog not found' })

        if (blogExists.author.toString() !== req.user.id.toString()) return res.status(401).json({ success: false, message: 'Unauthorized' });

        title && (blogExists.title = title)
        content && (blogExists.content = content)

        await blogExists.save()

        return res.status(200).json({ success: true, data: blogExists, message: 'Blog Updated Successfully' })
    } catch (error) {
        console.log("Updating Blog Issue ", error.message);
        return res.status(500).json({ success: false, data: {}, message: 'Server Error' })
    }
}

const deleteBlog = async (req, res) => {
    try {
        const id = req.params.id
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'Invalid Blog ID' });

        const blogExists = await Blog.findById(id)
        if (!blogExists) return res.status(404).json({ success: false, message: 'Blog not found' })

        if (blogExists.author.toString() !== req.user.id.toString()) return res.status(401).json({ success: false, message: 'Unauthorized' });

        await blogExists.deleteOne()

        return res.status(200).json({ success: true, data: {}, message: 'Blog Delete Successfully' })
    } catch (error) {
        console.log("Deleting Blog Issue ", error.message);
        return res.status(500).json({ success: false, data: {}, message: 'Server Error' })
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
            return res.status(404).json({ success: false, message: 'No Blogs found' })
        }
        return res.status(200).json({
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
        console.log("Retriving Blogs Issue ", error.message);
        return res.status(500).json({ success: false, data: {}, message: 'Server Error' })
    }
}

const singleRetrieveBlog = async (req, res) => {
    try {
        const id = req.params.id
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'Invalid Blog ID' });

        const blogExists = await Blog.findById(id)
        if (!blogExists) return res.status(404).json({ success: false, message: 'Blog not found' })

        return res.status(200).json({success: true, data: blogExists, message: 'Blog Revtrieve Successfully'})
    } catch (error) {
        console.log("Retriving Blogs Issue ", error.message);
        return res.status(500).json({ success: false, data: {}, message: 'Server Error' })
    }
}

module.exports = {
    createBlog,
    updateBlog,
    deleteBlog,
    retrieveBlogs,
    singleRetrieveBlog
}