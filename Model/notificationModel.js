const db = require("../Config/db");

// إضافة إشعار
const createNotification = async (user_id, type, reference_id, message) => {
  const [result] = await db.execute(
    `INSERT INTO notifications (user_id,type,reference_id,message) VALUES( ?, ?, ?, ?)`,
    [user_id, type, reference_id, message]
  );
  return result.insertId;
};

// جلب إشعارات المستخدم
const getNotificationsByUserId = async (user_id) => {
  const [rows] = await db.execute(
    `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC`,
    [user_id]
  );
  return rows;
};

// تعليم الإشعار كمقروء
const markAsRead = async (id) => {
  await db.execute(`UPDATE notifications SET is_read = 1 WHERE id = ?`, [id]);
};

// جلب إشعار واحد
const getNotificationById = async (id) => {
  const [rows] = await db.execute(`SELECT * FROM notifications WHERE id = ?`, [
    id,
  ]);
  return rows[0]; // يرجع إشعار واحد فقط
};

module.exports = {
  createNotification,
  getNotificationsByUserId,
  markAsRead,
  getNotificationById,
};
