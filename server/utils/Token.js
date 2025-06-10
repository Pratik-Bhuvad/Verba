const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/env')

const generateToken = (user) => {
    if (!user || !user._id) {
        throw new Error('User Object or user id is required')
    }
    try {
        const token = jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: '7d'
        })
        return token
    } catch (error) {
        console.log('Issue in token generation', error.message);
        throw error
    }
}

module.exports = {
    generateToken
}