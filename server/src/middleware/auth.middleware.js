const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    // ✅ Get token from cookie or Authorization header
    const token =
      req.cookies?.token ||
      (req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach user info to request
    req.user = decoded;

    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = { verifyToken };
