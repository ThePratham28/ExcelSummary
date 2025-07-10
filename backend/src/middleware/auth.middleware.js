import jwt from "jsonwebtoken";

export const authMiddleware = (requiredRole) => (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    // Check if role matches the required role
    if (requiredRole && decoded.role !== requiredRole) {
      return res.status(403).json({ message: "Forbidden: Access denied." });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
