const dotenv = require('dotenv')
dotenv.config()

module.exports = {
    PORT: process.env.PORT || 5000,
    DB_URI: process.env.DB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV || 'Development'
}