export const errorHandler = (err, req, res, next) => {
  console.log("ERROR: ", err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Server error",
  });
};
