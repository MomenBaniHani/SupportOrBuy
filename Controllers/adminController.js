const AdminModel = require("../Model/adminModel");

// جلب إحصائيات لوحة التحكم
exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await AdminModel.getDashboardStats();
    res.json(stats);
  } catch (err) {
    console.error("❌ Error fetching admin stats:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await AdminModel.deleteUserById(userId);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "✅ Deleted user successfully" });
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    res.status(500).json({ error: " Something wrong when deleted" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { username, role_id, is_active } = req.query;
    const users = await AdminModel.getAllUsers({
      username,
      role_id,
      is_active,
    });
    res.json(users);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ error: "An error occurred while fetching users." });
  }
};

exports.deleteUsersBulk = async (req, res) => {
  const { user_ids } = req.body;

  if (!Array.isArray(user_ids) || user_ids.length === 0) {
    return res
      .status(400)
      .json({ error: "The list of users must be sent for deletion." });
  }

  try {
    const result = await AdminModel.deleteUsersBulk(user_ids);
    res.json({ message: `✅  Deleted ${result.affectedRows} users` });
  } catch (err) {
    console.error("❌ Error in bulk delete:", err);
    res.status(500).json({ error: "Mass delete failed" });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const { is_active } = req.body;

    if (typeof is_active !== "boolean") {
      return res.status(400).json({ error: "The value is_active is invalid." });
    }

    await AdminModel.updateUserStatus(userId, is_active);

    res.json({ message: "✅ User status updated successfully" });
  } catch (err) {
    console.error("❌ Error updating user status:", err);
    res.status(500).json({ error: "Failed to update user status" });
  }
};
