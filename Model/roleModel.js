const db = require("../Config/db");

// جلب كل الأدوار
const getAllRoles = async () => {
  const [rows] = await db.execute("SELECT * FROM roles");
  return rows;
};

// إنشاء دور جديد
const createRole = async ({ name, key }) => {
  const [result] = await db.execute(
    "INSERT INTO roles (name, `key`) VALUES (?, ?)",
    [name, key]
  );
  return { id: result.insertId, name, key };
};

// جلب صلاحيات دور معين
const getRolePermissions = async (roleId) => {
  const [rows] = await db.execute(
    `
    SELECT p.id, p.key, p.description
    FROM permissions p
    JOIN role_permission rp ON rp.permission_id = p.id
    WHERE rp.role_id = ?
  `,
    [roleId]
  );

  return rows;
};

// ربط صلاحية مع دور
const assignPermissionToRole = async (roleId, permissionId) => {
  await db.execute(
    "INSERT IGNORE INTO role_permission (role_id, permission_id) VALUES (?, ?)",
    [roleId, permissionId]
  );
};

module.exports = {
  getAllRoles,
  createRole,
  getRolePermissions,
  assignPermissionToRole,
};
