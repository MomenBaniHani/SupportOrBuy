const express = require("express");
const router = express.Router();
const authController = require("../Controllers/authController");
const { verifyToken } = require("../Middlewares/authMiddleware");
const rateLimit = require('express-rate-limit');


// إعداد rateLimit لتسجيل الدخول
const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 2 دقائق
  max: 5, // 5 محاولات تسجيل دخول
  message: "🚫 Too many login attempts. Please try again later.",
});
router.post("/register", authController.register);
router.post("/login", loginLimiter, authController.login);
router.post("/logout", verifyToken, (req, res) => {
  res.json({ message: "🟢 You have successfully logged out." });
});
module.exports = router;
