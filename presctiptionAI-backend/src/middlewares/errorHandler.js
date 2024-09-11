const errorHandler = (err, req, res, next) => {
    console.error("Global Error Handler:", err); // Log the error for debugging
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message,
        error: err.errors || []
    });
};

module.exports = errorHandler;
