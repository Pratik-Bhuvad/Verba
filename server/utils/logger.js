const winston = require('winston');
const { NODE_ENV } = require('../config/env');

const logger = winston.createLogger({
    level: NODE_ENV === 'development' ? 'debug' : 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

// If we're in development, also log to the console
if (NODE_ENV === 'development') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

const logError = (error, location, additionalInfo = {}) => {
    logger.error({
        message: error.message,
        errorCode: error.code,
        stack: error.stack,
        location,
        ...additionalInfo
    });
};

const logInfo = (message, additionalInfo = {}) => {
    logger.info({
        message,
        ...additionalInfo
    });
};

module.exports = {
    logError,
    logInfo
};
