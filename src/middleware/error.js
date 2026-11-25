const AppError = require('../utils/AppError');

function notFound(req, res, next) {
    next(new AppError(
        `Route not found: ${req.method} ${req.originalUrl}`, 404
    ));
}

function errorHandler(err, req, res, next) {
    let status = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let details = err.details;

    // Mongoose validation error
    if (err.name === 'ValidationError' && err.errors) {
        status = 400;
        message = 'Validation failed';
        details = Object.values(err.errors).map((e) => ({
            field: e.path,
            message: e.message
        }));
    }

    // Invalid MongoDB ID
    if (err.name === 'CastError') {
        status = 400;
        message = `Invalid value for ${err.path}`;
    }

    // Duplicate email or other unique field
    if (err.code === 11000) {
        status = 409;
        const field = Object.keys(err.keyValue || {})[0] || 'field';
        message = `${field} already exists`;
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        status = 401;
        message = 'Invalid token';
    }

    if (err.name === 'TokenExpiredError') {
        status = 401;
        message = 'Token expired, please log in again';
    }

    // Invalid JSON
    if (err.type === 'entity.parse.failed') {
        status = 400;
        message = 'Malformed JSON body';
    }

    if (status >= 500) {
        console.error(err);

        if (process.env.NODE_ENV === 'production') {
            message = 'Internal Server Error';
        }
    }

    res.status(status).json({
        success: false,
        message,
        ...(details && { details }),
        ...(process.env.NODE_ENV === 'development' &&
            status >= 500 && { stack: err.stack }),
    });
}

module.exports = { notFound, errorHandler };