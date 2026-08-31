const adminMiddleware = (req, res, next) => {
  if (!req.student) {
    return res.status(401).json({
      message: "Unauthorized. Please login first.",
    });
  }
  if (req.student.role !== "admin") {
    return res.status(403).json({
      message: "Access denied. Admins only.",
    });
  }
  next();
};

module.exports = adminMiddleware;