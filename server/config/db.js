const mongoose = require('mongoose')
const {DB_URI} = require('./env')

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(DB_URI)
        console.log("Database Connected", conn.connection.host);
    } catch (error) {
        console.log("Database Connection Faild", error.message);
        process.exit(1) // Exit with failure
    }
}

module.exports = connectDB