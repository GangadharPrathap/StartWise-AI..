import { sendError } from '../utils/responseFormatter.js';

export const errorHandler = (err, req, res, next) => {
  console.error("Unhandled Error:", err);

  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : "Internal Server Error";

  // Provide more details in development mode
  if (process.env.NODE_ENV !== 'production') {
    return res.status(statusCode).json({
      status: "error",
      message: err.message,
      stack: err.stack,
      error: err
    });
  }

  return sendError(res, message, statusCode);
};
