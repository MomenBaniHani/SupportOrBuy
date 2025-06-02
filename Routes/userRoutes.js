const express = require("express");
const router = express.Router();
const userController = require("../Controllers/userController");
const { verifyToken } = require("../Middlewares/authMiddleware");
const uploadProfile = require("../Middlewares/uploadProfilePic"); // ✅ هنا

// الحصول على الملف الشخصي
router.get("/profile", verifyToken, userController.getProfile);

// تعديل الملف الشخصي مع رفع صورة
router.put(
  "/profile",
  verifyToken,
  uploadProfile.single("profile_picture"),
  userController.updateProfile
);

module.exports = router;
