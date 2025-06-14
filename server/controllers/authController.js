const User = require('../models/user')
const { validationResult } = require('express-validator')
const dataExists = require('../utils/DataExists')
const { hashing, compare } = require('../utils/Password')
const { generateToken } = require('../utils/Token')
const { HTTP_STATUS, ERROR_CODES } = require('../utils/errorConstants')
const { logError, logInfo } = require('../utils/logger')

const RegisterUser = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const error_messages = errors.array().map(err => err.msg)
        logError({ message: error_messages.join(', '), code: ERROR_CODES.INVALID_REQUEST }, 'RegisterUser')
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            data: error_messages,
            message: 'Invalid Request Arguments',
            errorCode: ERROR_CODES.INVALID_REQUEST
        })
    }
    try {
        const { username, email, password } = req.body
        const userExists = await dataExists({ username, email }, User)
        if (userExists.exists) {
            const errorCode = userExists.emailExists ? ERROR_CODES.EMAIL_TAKEN : ERROR_CODES.USERNAME_TAKEN
            const conflictMessage = userExists.emailExists
                ? 'User with this email already exists'
                : 'This username is already taken'
            logError({ message: conflictMessage, code: errorCode }, 'RegisterUser')
            return res.status(HTTP_STATUS.CONFLICT).json({
                success: false,
                data: {},
                message: conflictMessage,
                errorCode
            })
        }

        const hashPassword = await hashing(password)

        const newUser = await new User({
            username,
            email,
            password: hashPassword
        })


        const token = generateToken(newUser)
        res.cookie('Verba', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        await newUser.save();
        logInfo('User registered successfully', { userId: newUser._id })
        return res.status(HTTP_STATUS.CREATED).json({
            success: true,
            data: { username: newUser.username, email: newUser.email },
            message: 'User Registration Successful'
        })
    } catch (error) {
        logError(error, 'RegisterUser', { email: req.body.email })
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            data: {},
            message: 'Internal Server Error',
            errorCode: ERROR_CODES.DATABASE_ERROR
        })
    }
}

const Login = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const error_messages = errors.array().map(err => err.msg)
        logError({ message: error_messages.join(', '), code: ERROR_CODES.INVALID_REQUEST }, 'Login')
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            data: error_messages,
            message: 'Invalid Request Arguments',
            errorCode: ERROR_CODES.INVALID_REQUEST
        })
    }
    try {
        const { email, password } = req.body
        const userExists = await User.findOne({ email }).select('+password')

        if (!userExists) {
            logError({ message: 'User not found', code: ERROR_CODES.USER_NOT_FOUND }, 'Login', { email })
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                data: {},
                message: 'User with this email does not exist',
                errorCode: ERROR_CODES.USER_NOT_FOUND
            })
        }

        const legitmateUser = await compare(password, userExists.password)

        if (!legitmateUser) {
            logError({ message: 'Invalid credentials', code: ERROR_CODES.INVALID_CREDENTIALS }, 'Login', { email })
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                data: {},
                message: 'Invalid Credentials',
                errorCode: ERROR_CODES.INVALID_CREDENTIALS
            })

        }
            const token = generateToken(userExists)
            res.cookie('Verba', token, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            logInfo('User logged in successfully', { userId: userExists._id })
            return res.status(HTTP_STATUS.OK).json({
                success: true,
                data: { username: userExists.username, email: userExists.email },
                message: 'Login Successful'
            })
    } catch (error) {
        logError(error, 'Login', { email: req.body.email })
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            data: {},
            message: 'Internal Server Error',
            errorCode: ERROR_CODES.DATABASE_ERROR
        })
    }
}

const Logout = async (req, res) => {
    try {
        res.clearCookie('Verba')
        logInfo('User logged out successfully', { userId: req.user.id })
        res.json({ success: true, message: 'Logged out successfully' })
    } catch (error) {
        logError(error, 'Logout', { userId: req.user?.id })
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Internal Server Error',
            errorCode: ERROR_CODES.DATABASE_ERROR
        })
    }
}

module.exports = {
    RegisterUser,
    Login,
    Logout
}