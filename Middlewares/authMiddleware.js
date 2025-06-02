const jwt = require("jsonwebtoken");

// التحقق من التوكن بدون الحاجة لـ Bearer
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ error: "Token not found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ Token error:", err.message);
    return res.status(403).json({ error: "Invalid token" });
  }
};

module.exports = { verifyToken };
