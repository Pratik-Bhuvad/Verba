const http = require('http')
const { PORT, NODE_ENV } = require('./config/env')
const connectDB = require('./config/db')
const app = require('./app')

const startServer = async () => {
    try {
        await connectDB()
        const server = http.createServer(app)

        server.listen(PORT, () => {
            console.log(`Server is running in ${NODE_ENV} mode on http://localhost:${PORT}`);
        })

        server.on('error', (error) => {
            server.close(() => {
                console.error('Server Closed', error.message);
                process.exit(1) //Exit with failure
            })
        })

        process.on('SIGINT', () => {
            console.log('SIGINT received. Shutting down gracefully...');
            server.close(() => {
                console.log('Server closed');
                process.exit(0); // Exit process with success
            });
        })
    } catch (error) {
        console.error("Server Starting Error", error.message);
        process.exit(1)
    }
} 

startServer()