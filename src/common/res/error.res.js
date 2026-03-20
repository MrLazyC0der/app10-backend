

export const globalErrorHandler = (error, req, res, next) => {
    const statusCode = error.cause?.statusCode || 500;
    return res.status(statusCode).json({
        success: false,
        message: error.message,
        statusCode,
        errors: error.cause?.errors || undefined,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
};


export const AppError = ({
    message = "Something went wrong",
    cause = { statusCode: 500, errors: undefined },
}) => {
    throw new Error(message, { cause });
};

export const NotFoundError = (message = "Resource not found") => {
    AppError({ message, cause: { statusCode: 404 } });
};

export const ConflictError = (message = "Resource already exists") => {
    AppError({ message, cause: { statusCode: 409 } });
};

export const BadRequestError = (message = "Bad request", errors = undefined) => {
    AppError({ message, cause: { statusCode: 400, errors } });
};