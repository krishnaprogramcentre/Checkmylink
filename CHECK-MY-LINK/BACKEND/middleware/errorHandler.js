/**
 * Centralized Error Handling Middleware
 * Project: CHECK MY LINK
 * Developer: Krishan Kumar Verma
 */

/**
 * Handle 404 Route Not Found
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Route Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}. Verify your API path.`,
  });
};

/**
 * Global Error Handler
 */
const globalErrorHandler = (err, req, res, next) => {
  console.error('[SERVER ERROR]:', err.stack || err.message || err);

  const statusCode = err.status || err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: err.name || 'InternalServerError',
    message: err.message || 'An unexpected error occurred during link scanning.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = {
  notFoundHandler,
  globalErrorHandler,
};
