function errorHandler(err, req, res, next) {
  console.error("Error occurred:", err.message);
  // Log request details if available
  if (req) {
    console.error("Request URL:", req.url);
    console.error("Request Method:", req.method);
  }

  // Customize error response based on error type
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message });
}

module.exports = errorHandler;
