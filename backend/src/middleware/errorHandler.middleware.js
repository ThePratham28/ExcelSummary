export const errorHandler = (err, req, res, next) => {
  const statusCode = res.status === 200 ? 500 : res.status;

  console.error(
    process.env.NODE_ENV === "production" ? err.message : err.stack
  );

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
