// middleware/rateLimiting.js
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

// Different limits for different endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 15, // 5 attempts per window
    message: {
        success: false,
        message: 'Too many authentication attempts. Please try again in 15 minutes.',
        errorCode: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Progressive delays
    handler: (req, res) => {
        console.log(`Rate limit reached for IP: ${req.ip}`);
        res.status(429).json({
            success: false,
            message: 'Too many authentication attempts. Please try again in 15 minutes.',
            errorCode: 'RATE_LIMIT_EXCEEDED'
        });
    }
});

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // 100 requests per window
    message: {
        success: false,
        message: 'Too many API requests. Please slow down.',
        errorCode: 'API_RATE_LIMIT'
    }
});

const blogCreationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 blog posts per hour
    message: {
        success: false,
        message: 'Too many blogs created. Please wait an hour.',
        errorCode: 'BLOG_CREATION_LIMIT'
    }
});

// Progressive delay (slows down requests before blocking)
const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000,
    delayAfter: 50, // Allow 50 requests at full speed
    delayMs: () => 100 // Add 100ms delay per request after delayAfter
});

module.exports = {
    authLimiter,
    apiLimiter,
    blogCreationLimiter,
    speedLimiter
};