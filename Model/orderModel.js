const db = require("../Config/db");

// إنشاء طلب جديد مع عناصره
const createOrder = async (order, items) => {
  if (order.customer_id == order.artisan_id) {
    throw new Error("❌ You can't buy from yourself.");
  }
  const sql =
    "INSERT INTO orders (customer_id, artisan_id, total_amount) VALUES (?, ?, ?)";
  const values = [order.customer_id, order.artisan_id, order.total_amount];

  const [result] = await db.execute(sql, values);
  const orderId = result.insertId;

  const itemsValues = items.map((item) => [
    orderId,
    item.product_id,
    item.quantity,
    item.unit_price,
  ]);

  const itemSql =
    "INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ?";
  await db.query(itemSql, [itemsValues]);

  return { orderId };
};

// جلب الطلبات الخاصة بزبون معيّن
const getOrdersByCustomer = async (customer_id) => {
  const sql = `
    SELECT o.order_id, o.total_amount, o.status, o.created_at,
       oi.product_id, oi.quantity, oi.unit_price,
       p.title AS product_title,
       m.image_url
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
    LEFT JOIN media m ON p.product_id = m.product_id AND m.is_primary = 1
    WHERE o.customer_id = ?
    ORDER BY o.created_at DESC

  `;
  const [rows] = await db.execute(sql, [customer_id]);
  return rows;
};

// تحديث حالة الطلب
const updateStatus = async (orderId, status) => {
  const sql = `UPDATE orders SET status = ? WHERE order_id = ?`;
  const [result] = await db.execute(sql, [status, orderId]);
  return result;
};

// الطلبات الواردة للحرفي
const getIncomingOrdersByArtisan = async (artisan_id) => {
  const sql = `
    SELECT o.order_id, o.total_amount, o.status, o.created_at,
       oi.product_id, oi.quantity, oi.unit_price,
       p.title AS product_title,
       m.image_url
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
    LEFT JOIN media m ON p.product_id = m.product_id AND m.is_primary = 1
    WHERE o.artisan_id = ?
    ORDER BY o.created_at DESC

  `;
  const [rows] = await db.execute(sql, [artisan_id]);
  return rows;
};

const cancelOrderIfPending = async (orderId, customerId) => {
  const [orders] = await db.execute(
    'SELECT * FROM orders WHERE order_id = ? AND customer_id = ? AND status = "pending"',
    [orderId, customerId]
  );

  if (orders.length === 0) {
    return {
      success: false,
      message:
        "This order cannot be canceled. Your order may not have been placed or is no longer pending..",
    };
  }

  await db.execute("DELETE FROM orders WHERE order_id = ?", [orderId]);
  return { success: true };
};

const addOrderStatusHistory = async (order_id, status) => {
  await db.execute(
    `INSERT INTO order_status_history (order_id, status) VALUES (?, ?)`,
    [order_id, status]
  );
};
const getOrderStatusHistory = async (order_id) => {
  const [rows] = await db.execute(
    `SELECT status, changed_at FROM order_status_history WHERE order_id = ? ORDER BY changed_at ASC`,
    [order_id]
  );
  return rows;
};

const getOrderById = async (order_id) => {
  const [rows] = await db.execute(`SELECT * FROM orders WHERE order_id = ?`, [
    order_id,
  ]);
  return rows[0];
};

// جلب أسعار المنتجات حسب الـ product_id
const getProductPricesByIds = async (productIds) => {
  const placeholders = productIds.map(() => "?").join(",");
  const sql = `SELECT product_id, price FROM products WHERE product_id IN (${placeholders})`;
  const [rows] = await db.execute(sql, productIds);
  return rows;
};

const getAllOrders = async () => {
  const sql = `
    SELECT 
      o.order_id, o.total_amount, o.status, o.created_at,
      CONCAT(cu.first_name, ' ', cu.last_name) AS customer_name,
      CONCAT(ar.first_name, ' ', ar.last_name) AS artisan_name,
      p.title AS product_title,
      oi.quantity, oi.unit_price
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
    JOIN users cu ON o.customer_id = cu.user_id
    JOIN users ar ON o.artisan_id = ar.user_id
    ORDER BY o.created_at DESC
  `;
  const [rows] = await db.execute(sql);
  return rows;
};


module.exports = {
  createOrder,
  getOrdersByCustomer,
  updateStatus,
  getIncomingOrdersByArtisan,
  cancelOrderIfPending,
  addOrderStatusHistory,
  getOrderStatusHistory,
  getOrderById,
  getProductPricesByIds,
  getAllOrders,
};
