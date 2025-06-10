const dotenv = require('dotenv')
dotenv.config()

if (!process.env.JWT_SECRET || !process.env.NODE_ENV || !process.env.DB_URI) {
    console.error('Missing environment variables')
    process.exit(1)
}
module.exports = {
    PORT: process.env.PORT || 5000,
    DB_URI: process.env.DB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV || 'Development'
}