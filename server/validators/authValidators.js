const { body, check } = require('express-validator')

const RegisterValidations = [
    check('username')
        .notEmpty().withMessage("Username is required")
        .isLength({ min: 3, max: 20 }).withMessage("Username should be more than 3 characters and less than 20")
        .trim(),

    check('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Proper email id is required')
        .trim().toLowerCase(),

    check('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage("Password should be at least 8 characters long")
        .isStrongPassword({
            minLength: 8,
            minNumbers: 1,
            minLowercase: 1,
            minUppercase: 1,
            minSymbols: 1,
            minNumbers: 1
        }).withMessage('Not a strong Password')
]

const LoginValidations = [
    check('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Proper email id is required')
        .trim().toLowerCase(),

    check('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage("Invalid Credentials")
]

module.exports = {
    RegisterValidations,
    LoginValidations
}