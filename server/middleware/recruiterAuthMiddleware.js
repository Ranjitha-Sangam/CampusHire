const jwt = require("jsonwebtoken");

const recruiterAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "recruiter") {
      return res.status(403).json({
        message: "Access denied. Recruiters only.",
      });
    }

    req.recruiter = decoded;

    next();
  } catch (error) {
    console.log("Recruiter auth error:", error.message);
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = recruiterAuthMiddleware;
