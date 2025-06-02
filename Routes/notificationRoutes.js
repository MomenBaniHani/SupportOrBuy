const express = require("express");
const router = express.Router();
const { verifyToken } = require("../Middlewares/authMiddleware");
const { checkPermission } = require("../Middlewares/permissionMiddleware"); // تعديل Roles and Permissions
const {
  getUserNotifications,
  markNotificationAsRead,
} = require("../Controllers/notificationController");

// جميع إشعارات المستخدم
router.get(
  "/",
  verifyToken,
  checkPermission("view_notifications"),
  getUserNotifications
);

// تعليم إشعار كمقروء
router.put(
  "/:id/read",
  verifyToken,
  checkPermission("mark_notification_as_read"),
  markNotificationAsRead
);

module.exports = router;
