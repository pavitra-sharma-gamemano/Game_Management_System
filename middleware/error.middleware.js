const errorHandler = (err, req, res) => {
  console.error(err.stack); // Log the error stack for debugging

  // Customize the error response
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }), // Only show stack in development
  });
};

module.exports = errorHandler;
