const express = require("express");
const router = express.Router();
const roleController = require("../Controllers/roleController");
const { verifyToken } = require("../Middlewares/authMiddleware");
const { checkPermission } = require("../Middlewares/permissionMiddleware");

// جلب كل الأدوار
router.get(
  "/",
  verifyToken,
  checkPermission("manage_roles"),
  roleController.getAllRoles
);

// إنشاء دور جديد
router.post(
  "/",
  verifyToken,
  checkPermission("manage_roles"),
  roleController.createRole
);

// جلب صلاحيات دور معين
router.get(
  "/:id/permissions",
  verifyToken,
  checkPermission("manage_roles"),
  roleController.getRolePermissions
);

// ربط صلاحية بدور
router.post(
  "/assign-permission",
  verifyToken,
  checkPermission("manage_roles"),
  roleController.assignPermission
);

module.exports = router;
