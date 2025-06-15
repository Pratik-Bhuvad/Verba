// validators/blogValidators.js - Enhanced
const { check, body } = require('express-validator');
const validator = require('validator');

const blogValidation = [
    check('title')
        .notEmpty().withMessage('Blog title is required')
        .trim()
        .isLength({ min: 5, max: 200 }).withMessage('Title should be 5-200 characters')
        .matches(/^[a-zA-Z0-9\s\-_.,!?]+$/).withMessage('Title contains invalid characters')
        .escape(), // HTML escape

    check('content')
        .notEmpty().withMessage('Blog content is required')
        .isLength({ min: 10, max: 50000 }).withMessage('Content should be 10-50000 characters')
        .custom((value) => {
            // Remove HTML tags and check for script injections
            const sanitized = validator.stripLow(value);
            if (sanitized.includes('<script>') || sanitized.includes('javascript:')) {
                throw new Error('Content contains potentially malicious code');
            }
            return true;
        })
];
module.exports = {
    blogValidation
}