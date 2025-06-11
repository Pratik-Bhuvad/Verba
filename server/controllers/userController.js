const Blog = require('../models/Blog');
const User = require('../models/user');
const { compare } = require('../utils/Password');
const {validationResult} = require('express-validator')

const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        return res.status(200).json({ success: true, data: user, message: 'User Profile Retrieved Successfully' })
    } catch (error) {
        console.log("Retriving Profile Data Issue ", error.message);
        return res.status(500).json({ success: false, data: {}, message: 'Server Error' })
    }
}

const getMyBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ author: req.user.id }).sort({ createdAt: -1 })
        if (!blogs) return res.status(404).json({ success: false, message: 'Not Blogs found' })

        return res.status(200).json({ success: true, data: blogs, message: 'Blogs Retrivial Successful' })
    } catch (error) {
        console.log("Retriving Blogs Data Issue ", error.message);
        return res.status(500).json({ success: false, data: {}, message: 'Server Error' })
    }
}

const updateProfile = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const error_messages = errors.array().map(err => err.msg)
        console.log("Request Validation Errors ", error_messages);
        return res.status(400).json({ success: false, data: error_messages, message: 'Invalid Request Arguments' })
    }
    try {
        const user = await User.findById(req.user.id).select('+password')
        const { username, email, currentPassword, newPassword } = req.body

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const legitmateUser = await compare(currentPassword, user.password)
        if (!legitmateUser) return res.status(401).json({ success: false, data: {}, message: 'Invalid Credentials' })

        const samePassword = await compare(newPassword, user.password)
        if (samePassword) return res.status(409).json({ success: false, message: 'new password can not be same as old password' })

        user.username = username
        user.email = email
        user.password = newPassword

        await user.save()

        return res.status(200).json({ success: true, data: user, message: 'Profile Updation Successful' })
    } catch (error) {
        console.log("Updating User Data Issue ", error.message);
        return res.status(500).json({ success: false, data: {}, message: 'Server Error' })
    }
}

const deleteAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (user.id.toString() !== req.user.id.toString()) return res.status(403).json({ success: false, message: 'Unauthorized' })

        await user.deleteOne()
        return res.status(200).json({ success: true, message: 'Account Deleted' })
    } catch (error) {
        console.log("Deleting User Data Issue ", error.message);
        return res.status(500).json({ success: false, data: {}, message: 'Server Error' })

    }
}

const getUser = async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findById(id).select('username, email')
        if (!user) return res.status(404).json({ success: false, message: 'User Not Found' })

        const userBlogs = await Blog.find({author: id}).sort({ createdAt: -1 })
        if (!userBlogs) return res.status(200).json({ success: true, data: user, message: `User doesn't have any Blogs yet` })

        return res.status(200).json({ success: true, data: { user, userBlogs }, message: `Specific User retrivial data successful` })
    } catch (error) {
        console.log("Retriving User Data Issue ", error.message);
        return res.status(500).json({ success: false, data: {}, message: 'Server Error' })
    }
}

module.exports = {
    getMyProfile,
    getMyBlogs,
    updateProfile,
    deleteAccount,
    getUser
}