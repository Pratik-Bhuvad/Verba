const sanitize = require('mongo-sanitize');

// Recursively sanitize an object (deep sanitize)
const deepSanitize = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;

    for (const key in obj) {
        if (typeof obj[key] === 'object') {
            obj[key] = deepSanitize(obj[key]);
        } else {
            obj[key] = sanitize(obj[key]);
        }
    }

    return sanitize(obj);
};

const sanitizeMiddleware = (req, res, next) => {
    req.body = deepSanitize(req.body);
    req.query = deepSanitize(req.query);
    req.params = deepSanitize(req.params);
    next();
};

module.exports = sanitizeMiddleware;
