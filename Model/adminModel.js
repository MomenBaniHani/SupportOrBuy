const db = require("../Config/db");

const getDashboardStats = async () => {
  const [[users]] = await db.execute("SELECT COUNT(*) AS total FROM users");
  const [[products]] = await db.execute(
    "SELECT COUNT(*) AS total FROM products"
  );
  const [[orders]] = await db.execute("SELECT COUNT(*) AS total FROM orders");
  const [[supports]] = await db.execute(
    "SELECT COUNT(*) AS total FROM supports"
  );

  return {
    users: users.total,
    products: products.total,
    orders: orders.total,
    supports: supports.total,
  };
};

const deleteUserById = async (userId) => {
  const [result] = await db.execute("DELETE FROM users WHERE user_id = ?", [
    userId,
  ]);
  return result;
};

const getAllUsers = async ({ username, role_id, is_active }) => {
  let sql = `
    SELECT user_id, CONCAT(first_name, ' ', last_name) AS full_name, email, role_id, is_active, created_at
    FROM users
    WHERE 1=1
  `;
  let params = [];

  if (username) {
    sql += " AND CONCAT(first_name, ' ', last_name) LIKE ?";
    params.push(`%${username}%`);
  }

  if (role_id) {
    sql += " AND role_id = ?";
    params.push(role_id);
  }

  if (is_active !== undefined) {
    sql += " AND is_active = ?";
    params.push(is_active === "true" ? 1 : 0);
  }

  const [rows] = await db.execute(sql, params);
  return rows;
};


const deleteUsersBulk = async (user_ids) => {
  const placeholders = user_ids.map(() => "?").join(",");
  const [result] = await db.execute(
    `DELETE FROM users WHERE user_id IN (${placeholders})`,
    user_ids
  );
  return result;
};

const updateUserStatus = async (userId, isActive) => {
  const sql = `UPDATE users SET is_active = ? WHERE user_id = ?`;
  await db.execute(sql, [isActive, userId]);
};

module.exports = {
  getDashboardStats,
  deleteUserById,
  getAllUsers,
  deleteUsersBulk,
  updateUserStatus,
};
