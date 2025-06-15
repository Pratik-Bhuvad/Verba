const mongoose = require('mongoose')
const { DB_URI, NODE_ENV } = require('./env')

const connectDB = async () => {
    try {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            bufferCommands: false, // Disable mongoose buffering
            // bufferMaxEntries: 0, // Disable mongoose buffering
        };

        if (NODE_ENV === 'production') {
            options.ssl = true;
            options.sslValidate = true;
        }

        const conn = await mongoose.connect(DB_URI, options)
        console.log("Database Connected", conn.connection.host);

        mongoose.connection.on('error', (err) => {
            console.error('Database connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Database disconnected');
        });
    } catch (error) {
        console.log("Database Connection Faild", error.message);
        process.exit(1) // Exit with failure
    }
}

module.exports = connectDB