const User = require('../models/user')
const { validationResult } = require('express-validator')
const dataExists = require('../utils/DataExists')
const { hashing, compare } = require('../utils/Password')
const { generateToken } = require('../utils/Token')

const RegisterUser = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const error_messages = errors.array().map(err => err.msg)
        console.log("Request Validation Errors ", error_messages);
        return res.status(400).json({ success: false, data: error_messages, message: 'Invalid Request Arguments' })
    }
    try {
        const { username, email, password } = req.body
        const userExists = await dataExists({ username, email }, User)

        if (userExists.exists) {
            const conflict = []
            if (userExists.usernameExists) conflict.push('Username')
            if (userExists.emailExists) conflict.push('email')
            return res.status(409).json({ success: false, data: { conflict: conflict }, message: `${conflict.includes('email') ? 'User with this credentials already exits' : 'Username already Taken'}` })
        }

        const hashPassword = await hashing(password)

        const newUser = await User({
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
        return res.status(201).json({ success: true, data: { username: newUser.username, email: newUser.email }, message: 'User Registration Successfull' })
    } catch (error) {
        console.log("Register User Issue ", error.message);
        return res.status(500).json({ success: false, data: {}, message: 'Server Error' })
    }
}

const Login = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const error_messages = errors.array().map(err => err.msg)
        console.log("Request Validation Errors ", error_messages);
        return res.status(400).json({ success: false, data: error_messages, message: 'Invalid Request Arguments' })
    }
    try {
        const { email, password } = req.body
        const userExists = await User.findOne({ email }).select('+password')

        if (!userExists) return res.status(404).json({ success: false, data: {}, message: 'User with this credentials does not exists' })

        const legitmateUser = await compare(password, userExists.password)

        if (!legitmateUser) return res.status(401).json({ success: false, data: {}, message: 'Invalid Credentials' })

        const token = generateToken(userExists)
        res.cookie('Verba', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json({ success: true, data: { username: userExists.username, email: userExists.email }, message: 'Login Successful' })
    } catch (error) {
        console.log("Login User Issue ", error.message);
        return res.status(500).json({ success: false, data: {}, message: 'Server Error' })
    }
}

module.exports = {
    RegisterUser,
    Login
}