const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from headers
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
