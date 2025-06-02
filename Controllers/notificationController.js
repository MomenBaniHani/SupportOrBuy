const Notification = require("../Model/notificationModel");

// جلب إشعارات المستخدم
exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.getNotificationsByUserId(userId);
    res.json(notifications);
  } catch (err) {
    console.error("Error fetching notifications : ", err.message);
    res.status(500).json({ error: "Error fetching notifications " });
  }
};

// تعليم إشعار كمقروء
exports.markNotificationAsRead = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;

    // 🔐 تحقق من ملكية الإشعار
    const notification = await Notification.getNotificationById(id);

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    if (notification.user_id !== userId) {
      return res
        .status(403)
        .json({ error: "You are not permitted to modify this notice." });
    }

    await Notification.markAsRead(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Error updating notification" });
  }
};
