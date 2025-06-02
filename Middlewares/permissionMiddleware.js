const { getUserPermissions } = require("../Model/permissionModel");

// middleware لفحص صلاحية محددة
const checkPermission = (permissionKey) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id; // بدل user.user_id

      const permissions = await getUserPermissions(userId);

      const hasPermission = permissions.includes(permissionKey);

      if (!hasPermission) {
        return res.status(403).json({
          error: "❌ You do not have the authority to perform this action.",
        });
      }

      next(); // المستخدم لديه الصلاحية، تابع التنفيذ
    } catch (err) {
      console.error("⚠️ Permissions verification error:", err.message);
      return res.status(500).json({ error: "An internal error occurred." });
    }
  };
};

module.exports = { checkPermission };
