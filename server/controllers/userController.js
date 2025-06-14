const Blog = require('../models/Blog');
const User = require('../models/user');
const { compare, hashing } = require('../utils/Password');
const { validationResult } = require('express-validator');
const { HTTP_STATUS, ERROR_CODES } = require('../utils/errorConstants');
const { logError, logInfo } = require('../utils/logger');

const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user) {
            logError({ message: 'User profile not found', code: ERROR_CODES.PROFILE_NOT_FOUND }, 'getMyProfile', { userId: req.user.id })
            return res.status(HTTP_STATUS.NOT_FOUND).json({ 
                success: false, 
                message: 'User not found',
                errorCode: ERROR_CODES.PROFILE_NOT_FOUND 
            });
        }

        logInfo('User profile retrieved successfully', { userId: user._id })
        return res.status(HTTP_STATUS.OK).json({ 
            success: true, 
            data: user, 
            message: 'User Profile Retrieved Successfully' 
        })
    } catch (error) {
        logError(error, 'getMyProfile', { userId: req.user.id })
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
            success: false, 
            data: {}, 
            message: 'Internal Server Error',
            errorCode: ERROR_CODES.DATABASE_ERROR 
        })
    }
}

const getMyBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ author: req.user.id }).sort({ createdAt: -1 })
        if (!blogs || blogs.length === 0) {
            logInfo('No blogs found for user', { userId: req.user.id })
            return res.status(HTTP_STATUS.NOT_FOUND).json({ 
                success: false, 
                message: 'No blogs found',
                errorCode: ERROR_CODES.BLOG_NOT_FOUND 
            })
        }

        logInfo('User blogs retrieved successfully', { userId: req.user.id, blogCount: blogs.length })
        return res.status(HTTP_STATUS.OK).json({ 
            success: true, 
            data: blogs, 
            message: 'Blogs Retrieved Successfully' 
        })
    } catch (error) {
        logError(error, 'getMyBlogs', { userId: req.user.id })
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
            success: false, 
            data: {}, 
            message: 'Internal Server Error',
            errorCode: ERROR_CODES.DATABASE_ERROR 
        })
    }
}

const updateProfile = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const error_messages = errors.array().map(err => err.msg)
        logError({ message: error_messages.join(', '), code: ERROR_CODES.INVALID_REQUEST }, 'updateProfile')
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
            success: false, 
            data: error_messages, 
            message: 'Invalid Request Arguments',
            errorCode: ERROR_CODES.INVALID_REQUEST 
        })
    }
    try {
        const user = await User.findById(req.user.id).select('+password')
        const { username, email, currentPassword, newPassword } = req.body

        if (!user) {
            logError({ message: 'User not found', code: ERROR_CODES.PROFILE_NOT_FOUND }, 'updateProfile', { userId: req.user.id })
            return res.status(HTTP_STATUS.NOT_FOUND).json({ 
                success: false, 
                message: 'User not found',
                errorCode: ERROR_CODES.PROFILE_NOT_FOUND 
            });
        }

        const legitimateUser = await compare(currentPassword, user.password)
        if (!legitimateUser) {
            logError({ message: 'Invalid current password', code: ERROR_CODES.INVALID_CREDENTIALS }, 'updateProfile', { userId: req.user.id })
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({ 
                success: false, 
                data: {}, 
                message: 'Invalid current password',
                errorCode: ERROR_CODES.INVALID_CREDENTIALS 
            })
        }

        if (newPassword) {
            const samePassword = await compare(newPassword, user.password)
            if (samePassword) {
                logError({ message: 'New password same as current password', code: ERROR_CODES.INVALID_PASSWORD }, 'updateProfile', { userId: req.user.id })
                return res.status(HTTP_STATUS.CONFLICT).json({ 
                    success: false, 
                    message: 'New password cannot be same as current password',
                    errorCode: ERROR_CODES.INVALID_PASSWORD 
                })
            }
        }

        user.username = username
        user.email = email
        newPassword && (user.password = await hashing(newPassword))
        await user.save()

        user.password = undefined
        logInfo('User profile updated successfully', { userId: user._id })
        return res.status(HTTP_STATUS.OK).json({ 
            success: true, 
            data: user, 
            message: 'Profile Updated Successfully' 
        })
    } catch (error) {
        logError(error, 'updateProfile', { userId: req.user.id })
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
            success: false, 
            data: {}, 
            message: 'Internal Server Error',
            errorCode: ERROR_CODES.DATABASE_ERROR 
        })
    }
}

const deleteAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user) {
            logError({ message: 'User not found', code: ERROR_CODES.PROFILE_NOT_FOUND }, 'deleteAccount', { userId: req.user.id })
            return res.status(HTTP_STATUS.NOT_FOUND).json({ 
                success: false, 
                message: 'User not found',
                errorCode: ERROR_CODES.PROFILE_NOT_FOUND 
            });
        }

        if (user.id.toString() !== req.user.id.toString()) {
            logError({ message: 'Unauthorized account deletion attempt', code: ERROR_CODES.UNAUTHORIZED_BLOG_ACCESS }, 'deleteAccount', { userId: req.user.id })
            return res.status(HTTP_STATUS.FORBIDDEN).json({ 
                success: false, 
                message: 'Unauthorized',
                errorCode: ERROR_CODES.UNAUTHORIZED_BLOG_ACCESS 
            })
        }

        await user.deleteOne()
        logInfo('User account deleted successfully', { userId: user._id })
        return res.status(HTTP_STATUS.OK).json({ 
            success: true, 
            message: 'Account Deleted Successfully' 
        })
    } catch (error) {
        logError(error, 'deleteAccount', { userId: req.user.id })
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
            success: false, 
            data: {}, 
            message: 'Internal Server Error',
            errorCode: ERROR_CODES.DATABASE_ERROR 
        })
    }
}

const getUser = async (req, res) => {
    try {
        const id = req.params.id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            logError({ message: 'Invalid user ID', code: ERROR_CODES.INVALID_REQUEST }, 'getUser', { id })
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
                success: false, 
                message: 'Invalid User ID',
                errorCode: ERROR_CODES.INVALID_REQUEST 
            });
        }

        const user = await User.findById(id).select('username email')
        if (!user) {
            logError({ message: 'User not found', code: ERROR_CODES.USER_NOT_FOUND }, 'getUser', { id })
            return res.status(HTTP_STATUS.NOT_FOUND).json({ 
                success: false, 
                message: 'User Not Found',
                errorCode: ERROR_CODES.USER_NOT_FOUND 
            })
        }

        const userBlogs = await Blog.find({ author: id }).sort({ createdAt: -1 })
        if (!userBlogs || userBlogs.length === 0) {
            logInfo('User found but has no blogs', { userId: id })
            return res.status(HTTP_STATUS.OK).json({ 
                success: true, 
                data: user, 
                message: `User doesn't have any blogs yet` 
            })
        }

        logInfo('User and their blogs retrieved successfully', { userId: id, blogCount: userBlogs.length })
        return res.status(HTTP_STATUS.OK).json({ 
            success: true, 
            data: { user, userBlogs }, 
            message: 'User data retrieved successfully' 
        })
    } catch (error) {
        logError(error, 'getUser', { userId: req.params.id })
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
            success: false, 
            data: {}, 
            message: 'Internal Server Error',
            errorCode: ERROR_CODES.DATABASE_ERROR 
        })
    }
}

const getUserDetails = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const error_messages = errors.array().map(err => err.msg)
        logError({ message: error_messages.join(', '), code: ERROR_CODES.INVALID_REQUEST }, 'getUserDetails')
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
            success: false, 
            data: error_messages, 
            message: 'Invalid Request Arguments',
            errorCode: ERROR_CODES.INVALID_REQUEST 
        })
    }
    try {
        const { search } = req.query
        if (!search || search === null || search === undefined || search === '') {
            logError({ message: 'Missing search query', code: ERROR_CODES.INVALID_REQUEST }, 'getUserDetails')
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
                success: false, 
                message: 'Search query is required',
                errorCode: ERROR_CODES.INVALID_REQUEST 
            })
        }

        const user = await User.find({
            $or: [
                { username: search },
                { email: search }
            ]
        }).select('username email id')

        if (!user || user.length === 0) {
            logError({ message: 'User not found', code: ERROR_CODES.USER_NOT_FOUND }, 'getUserDetails', { search })
            return res.status(HTTP_STATUS.NOT_FOUND).json({ 
                success: false, 
                message: 'User Not Found',
                errorCode: ERROR_CODES.USER_NOT_FOUND 
            })
        }

        const userBlogs = await Blog.find({ author: user[0].id }).sort({ createdAt: -1 })
        if (!userBlogs || userBlogs.length === 0) {
            logInfo('User found but has no blogs', { userId: user[0].id })
            return res.status(HTTP_STATUS.OK).json({ 
                success: true, 
                data: user[0], 
                message: `User doesn't have any blogs yet` 
            })
        }

        logInfo('User and their blogs retrieved successfully', { userId: user[0].id, blogCount: userBlogs.length })
        return res.status(HTTP_STATUS.OK).json({ 
            success: true, 
            data: { user: user[0], userBlogs }, 
            message: 'User data retrieved successfully' 
        })
    } catch (error) {
        logError(error, 'getUserDetails', { searchQuery: req.query.search })
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
            success: false, 
            data: {}, 
            message: 'Internal Server Error',
            errorCode: ERROR_CODES.DATABASE_ERROR 
        })
    }
}

module.exports = {
    getMyProfile,
    getMyBlogs,
    updateProfile,
    deleteAccount,
    getUser,
    getUserDetails
}