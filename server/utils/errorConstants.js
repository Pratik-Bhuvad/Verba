// HTTP Status Codes
const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
};

// Error Codes
const ERROR_CODES = {
    // Auth related errors (1xxx)
    INVALID_CREDENTIALS: 'AUTH_1001',
    USER_NOT_FOUND: 'AUTH_1002',
    USER_EXISTS: 'AUTH_1003',
    INVALID_TOKEN: 'AUTH_1004',
    
    // Blog related errors (2xxx)
    BLOG_NOT_FOUND: 'BLOG_2001',
    BLOG_EXISTS: 'BLOG_2002',
    INVALID_BLOG_ID: 'BLOG_2003',
    UNAUTHORIZED_BLOG_ACCESS: 'BLOG_2004',
    
    // User related errors (3xxx)
    PROFILE_NOT_FOUND: 'USER_3001',
    INVALID_PASSWORD: 'USER_3002',
    USERNAME_TAKEN: 'USER_3003',
    EMAIL_TAKEN: 'USER_3004',
    
    // Validation errors (4xxx)
    INVALID_REQUEST: 'VAL_4001',
    
    // Server errors (5xxx)
    DATABASE_ERROR: 'SRV_5001',
    TOKEN_GENERATION_ERROR: 'SRV_5002'
};

module.exports = {
    HTTP_STATUS,
    ERROR_CODES
};
