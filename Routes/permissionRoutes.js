const express = require("express");
const router = express.Router();
const permissionController = require("../Controllers/permissionController");
const { verifyToken } = require("../Middlewares/authMiddleware");
const { checkPermission } = require("../Middlewares/permissionMiddleware");

// جلب كل الصلاحيات
router.get(
  "/",
  verifyToken,
  checkPermission("manage_roles"),
  permissionController.getAllPermissions
);

// إنشاء صلاحية جديدة
router.post(
  "/",
  verifyToken,
  checkPermission("manage_roles"),
  permissionController.createPermission
);

module.exports = router;
