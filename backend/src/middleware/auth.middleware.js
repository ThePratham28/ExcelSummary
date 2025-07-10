import jwt from "jsonwebtoken";

export const authMiddleware = (requiredRole) => (req, res, next) => {
  const logger = res.locals.logger;
  const token = req.cookies.token;

  // Log authentication attempt
  logger.debug("Authentication attempt", {
    path: req.originalUrl,
    method: req.method,
    requiredRole,
  });

  if (!token) {
    logger.warn("Authentication failed: No token provided", {
      path: req.originalUrl,
      method: req.method,
      requiredRole,
    });
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    // Check if role matches the required role
    if (requiredRole && decoded.role !== requiredRole) {
      logger.warn("Authorization failed: Insufficient permissions", {
        userId: decoded.id,
        userRole: decoded.role,
        requiredRole,
        path: req.originalUrl,
        method: req.method,
      });
      return res.status(403).json({ message: "Forbidden: Access denied." });
    }

    logger.info("Authentication successful", {
      userId: decoded.id,
      userRole: decoded.role,
      path: req.originalUrl,
      method: req.method,
    });

    next();
  } catch (error) {
    logger.warn("Authentication failed: Invalid token", {
      error: error.message,
      path: req.originalUrl,
      method: req.method,
      requiredRole,
    });
    return res.status(401).json({ message: "Invalid token" });
  }
};
