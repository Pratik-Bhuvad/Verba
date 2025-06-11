const Blog = require('../models/Blog')
const { validationResult } = require('express-validator')
const dataExists = require('../utils/DataExists')

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

module.exports = {
    createBlog
}