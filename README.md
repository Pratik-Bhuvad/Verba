# Verba Backend

A robust and secure backend service for managing blogs and user authentication.

## Features

- User Authentication & Authorization
- Blog Post Management
- Rate Limiting
- Input Sanitization
- Secure Password Management
- JWT Token Based Authentication
- Logging System
- Data Validation

## Project Structure

```
server/
├── app.js                 # Express app configuration
├── server.js             # Server entry point
├── config/               # Configuration files
│   ├── db.js            # Database configuration
│   └── env.js           # Environment variables
├── controllers/          # Request handlers
│   ├── authController.js
│   ├── blogController.js
│   └── userController.js
├── middleware/          # Custom middleware
│   ├── authMiddleware.js
│   ├── rateLimiting.js
│   ├── sanitize.js
│   └── security.js
├── models/             # Database models
│   ├── Blog.js
│   └── user.js
├── routes/            # API routes
│   ├── authRoutes.js
│   ├── blogRoutes.js
│   └── userRoutes.js
├── utils/            # Utility functions
│   ├── DataExists.js
│   ├── errorConstants.js
│   ├── logger.js
│   ├── Password.js
│   └── Token.js
└── validators/       # Input validation
    ├── authValidators.js
    ├── blogValidators.js
    └── profileUpdation.js
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   cd server
   npm install
   ```
3. Set up environment variables
4. Start the server:
   ```bash
   npm start
   ```

## Security Features

- Password hashing
- JWT token authentication
- Input sanitization
- Rate limiting
- Secure HTTP headers
- Request validation

## API Documentation

The API endpoints are organized into three main categories:

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout

### User Management
- GET /api/users/profile
- PUT /api/users/profile
- DELETE /api/users/account

### Blog Operations
- GET /api/blogs
- POST /api/blogs
- PUT /api/blogs/:id
- DELETE /api/blogs/:id

## Error Handling

The application implements a centralized error handling system with standardized error responses and logging.
