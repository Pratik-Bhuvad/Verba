const { body, check } = require('express-validator')

const RegisterValidations = [
    check('username')
        .notEmpty().withMessage("Username is required")
        .isLength({ min: 3, max: 20 }).withMessage("Username should be 3-20 characters")
        .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can only contain letters, numbers, and underscores")
        .trim()
        .escape(),

    check('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail()
        .custom(async (email) => {
            // Check for disposable email domains
            const disposableDomains = ['10minutemail.com', 'guerrillamail.com'];
            const domain = email.split('@')[1];
            if (disposableDomains.includes(domain)) {
                throw new Error('Disposable email addresses are not allowed');
            }
            return true;
        }),

    check('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8, max: 128 }).withMessage("Password should be 8-128 characters")
        .isStrongPassword({
            minLength: 8,
            minNumbers: 1,
            minLowercase: 1,
            minUppercase: 1,
            minSymbols: 1
        }).withMessage('Password must contain uppercase, lowercase, number, and special character')
        .custom((password) => {
            // Check for common passwords
            const commonPasswords = ['password123', '12345678', 'qwerty123'];
            if (commonPasswords.includes(password.toLowerCase())) {
                throw new Error('Password is too common');
            }
            return true;
        })
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