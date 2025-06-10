const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/env')

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.Verba || req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' });
            req.user = decoded
            next()
        })
    } catch (error) {
        console.error('JWT verification error:- ', error.message);
        throw error
    }
}

module.exports = authMiddleware