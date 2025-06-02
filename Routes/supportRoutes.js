const express = require("express");
const router = express.Router();
const supportController = require("../Controllers/supportController");
const { verifyToken } = require("../Middlewares/authMiddleware");
const { checkPermission } = require("../Middlewares/permissionMiddleware"); // تعديل Roles and Permissions

// الراوت الخاص بإرسال الدعم
router.post(
  "/",
  verifyToken,
  checkPermission("send_support"), // تعديل Roles and Permissions
  supportController.sendSupport
);

router.get(
  "/all",
  verifyToken,
  checkPermission("support_view_all"), // صلاحية جديدة للإداري
  supportController.getAllSupports
);

module.exports = router;
