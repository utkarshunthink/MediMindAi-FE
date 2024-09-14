class ApiError extends Error {
    constructor(message, statusCode, res, errors = []) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        if (res) {
            res.status(statusCode).json({
                success: false,
                message,
                errors
            })
        }
    }
}

module.exports = ApiError;