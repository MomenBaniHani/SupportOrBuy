const express = require("express");
const router = express.Router();
const adminController = require("../Controllers/adminController");
const { verifyToken } = require("../Middlewares/authMiddleware");
const { checkPermission } = require("../Middlewares/permissionMiddleware");

// إحصائيات لوحة التحكم
router.get(
  "/stats",
  verifyToken,
  checkPermission("manage_dashboard"),
  adminController.getDashboardStats
);
// ✅ حذف جماعي
router.delete(
  "/bulk",
  verifyToken,
  checkPermission("delete_user"),
  adminController.deleteUsersBulk
);

router.delete(
  "/:id",
  verifyToken,
  checkPermission("delete_user"),
  adminController.deleteUser
);

//all without filter
router.get(
  "/all",
  verifyToken,
  checkPermission("view_users"),
  adminController.getAllUsers
);

// ✅ فلترة المستخدمين
router.get(
  "/all",
  verifyToken,
  checkPermission("view_users"),
  adminController.getAllUsers
);

router.patch(
  "/:id/status",
  verifyToken,
  checkPermission("user_update_status"),
  adminController.toggleUserStatus
);

module.exports = router;
