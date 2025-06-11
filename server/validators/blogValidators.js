const {check} = require('express-validator')

const blogValidation = [
    check('title')
        .notEmpty().withMessage(`Blog's Title is required`)
        .trim()
        .isLength({min:5}).withMessage('Title should have at least 5 characters'),

    check('content')
        .notEmpty().withMessage(`Blog's Content is required`)
]

module.exports = {
    blogValidation
}