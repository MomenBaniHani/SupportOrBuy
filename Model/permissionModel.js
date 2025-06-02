const db = require("../Config/db");

// إنشاء صلاحية جديدة
const createPermission = async ({ key, description }) => {
  const [result] = await db.execute(
    "INSERT INTO permissions (`key`, description) VALUES (?, ?)",
    [key, description]
  );
  return { id: result.insertId, key, description };
};

// جلب كل الصلاحيات
const getAllPermissions = async () => {
  const [rows] = await db.execute("SELECT * FROM permissions");
  return rows;
};

// جلب صلاحيات مستخدم (عبر role_id)
const getUserPermissions = async (userId) => {
  const [rows] = await db.execute(
    `
    SELECT p.key
    FROM users u
    JOIN roles r ON u.role_id = r.id
    JOIN role_permission rp ON rp.role_id = r.id
    JOIN permissions p ON p.id = rp.permission_id
    WHERE u.user_id = ?
  `,
    [userId]
  );

  return rows.map((row) => row.key); // ترجع مصفوفة من النصوص مثل ["create_product", "delete_user"]
};

module.exports = {
  createPermission,
  getAllPermissions,
  getUserPermissions,
};
