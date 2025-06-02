const db = require("../Config/db");

// إنشاء منتج جديد
const createProduct = async (product) => {
  const sql = `
    INSERT INTO products (
      user_id, title, description, price, category, product_type,
      is_for_sale, is_for_support, support_description, support_amount
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    product.user_id,
    product.title,
    product.description,
    product.price,
    product.category,
    product.product_type,
    product.is_for_sale,
    product.is_for_support,
    product.support_description,
    product.support_amount,
  ];

  const [result] = await db.execute(sql, values);
  return result;
};

// جلب كل المنتجات (إداري)
const getAllProduct = async () => {
  const sql = `
    SELECT 
      p.product_id, p.title, p.price, p.created_at, p.category,
      CONCAT(u.first_name, ' ', u.last_name) AS artisan_name
    FROM products p
    JOIN users u ON p.user_id = u.user_id
    WHERE p.is_active = true
  `;
  const [rows] = await db.execute(sql);
  return rows;
};


// جلب مع الفلاتر
const getFilteredProducts = async (filters) => {
  let sql = `
    SELECT p.*, m.image_url
    FROM products p
    LEFT JOIN media m ON p.product_id = m.product_id AND m.is_primary = TRUE
    WHERE p.is_active = true
  `;

  const values = [];

  if (filters.user_id) {
    sql += " AND p.user_id = ?";
    values.push(filters.user_id);
  }

  if (filters.category) {
    sql += " AND p.category = ?";
    values.push(filters.category);
  }

  if (filters.type === "support") {
    sql += " AND p.is_for_support = 1";
  } else if (filters.type === "buy") {
    sql += " AND p.is_for_sale = 1";
  }

  if (filters.order === "newest") {
    sql += " ORDER BY p.created_at DESC";
  } else if (filters.order === "popular") {
    if (filters.type === "support") {
      sql += `
        ORDER BY (
          SELECT COALESCE(SUM(s.amount), 0)
          FROM supports s
          WHERE s.product_id = p.product_id
        ) DESC
      `;
    } else if (filters.type === "buy") {
      sql += `
        ORDER BY (
          SELECT COUNT(*)
          FROM order_items oi
          WHERE oi.product_id = p.product_id
        ) DESC
      `;
    } else {
      sql += `
        ORDER BY (
          (
            SELECT COUNT(*) FROM order_items oi WHERE oi.product_id = p.product_id
          ) +
          (
            SELECT COUNT(*) FROM supports s WHERE s.product_id = p.product_id
          )
        ) DESC
      `;
    }
  }

  const [rows] = await db.execute(sql, values);
  return rows;
};

// ✅ تعديل البحث ليرجع الصور
const searchProducts = async ({
  query,
  category,
  min_price,
  max_price,
  is_for_sale,
  is_for_support,
  order,
}) => {
  let sql = `
    SELECT p.*, m.image_url
    FROM products p
    LEFT JOIN media m ON p.product_id = m.product_id AND m.is_primary = 1
    WHERE p.is_active = 1
  `;
  let params = [];

  if (query) {
    sql += ` AND (
    LOWER(p.title) LIKE LOWER(?) OR
    LOWER(p.description) LIKE LOWER(?) OR
    LOWER(p.category) LIKE LOWER(?)
  )`;
    params.push(`%${query}%`, `%${query}%`, `%${query}%`);
  } else if (category) {
    sql += ` AND p.category = ?`;
    params.push(category);
  }

  if (min_price) {
    sql += ` AND p.price >= ?`;
    params.push(min_price);
  }

  if (max_price) {
    sql += ` AND p.price <= ?`;
    params.push(max_price);
  }

  if (is_for_sale !== undefined) {
    sql += ` AND p.is_for_sale = ?`;
    params.push(is_for_sale);
  }

  if (is_for_support !== undefined) {
    sql += ` AND p.is_for_support = ?`;
    params.push(is_for_support);
  }

  if (order === "newest") {
    sql += ` ORDER BY p.created_at DESC`;
  } else if (order === "popular") {
    if (is_for_support === 1) {
      sql += `
      ORDER BY (
        SELECT COALESCE(SUM(s.amount), 0)
        FROM supports s
        WHERE s.product_id = p.product_id
      ) DESC
    `;
    } else if (is_for_sale === 1) {
      sql += `
      ORDER BY (
        SELECT COUNT(*)
        FROM order_items oi
        WHERE oi.product_id = p.product_id
      ) DESC
    `;
    } else {
      sql += `
      ORDER BY (
        (
          SELECT COUNT(*) FROM order_items oi WHERE oi.product_id = p.product_id
        ) +
        (
          SELECT COUNT(*) FROM supports s WHERE s.product_id = p.product_id
        )
      ) DESC
    `;
    }
  }

  const [rows] = await db.execute(sql, params);
  return rows;
};

const getProductById = async (productId) => {
  const sql = `
    SELECT p.*, 
           CONCAT(u.first_name, ' ', u.last_name) AS artisan_name, 
           u.bio, u.profile_picture,
           p.support_amount,
           (SELECT m.image_url FROM media m WHERE m.product_id = p.product_id AND m.is_primary = 1 LIMIT 1) AS product_image,
           (SELECT COALESCE(SUM(s.amount), 0) FROM supports s WHERE s.product_id = p.product_id) AS supported_amount
    FROM products p
    JOIN users u ON p.user_id = u.user_id
    WHERE p.product_id = ?
  `;
  const [rows] = await db.execute(sql, [productId]);
  return rows[0] || null;
};




const updateProduct = async (productId, userId, data) => {
  const fields = [
    "title = ?",
    "description = ?",
    "price = ?",
    "category = ?",
    "product_type = ?",
    "is_for_sale = ?",
    "is_for_support = ?",
    "support_description = ?",
    "support_amount = ?",
  ];

  const values = [
    data.title,
    data.description,
    data.price,
    data.category,
    data.product_type,
    data.is_for_sale,
    data.is_for_support,
    data.support_description,
    data.support_amount,
    productId,
    userId,
  ];

  const sql = `UPDATE products SET ${fields.join(
    ", "
  )} WHERE product_id = ? AND user_id = ?`;
  const [result] = await db.execute(sql, values);
  return result;
};

const deleteProduct = async (productId, userId) => {
  await db.execute("DELETE FROM media WHERE product_id = ?", [productId]);
  const [result] = await db.execute(
    "DELETE FROM products WHERE product_id = ? AND user_id = ?",
    [productId, userId]
  );
  return result;
};
const deleteProductById = async (productId) => {
  const [result] = await db.execute(
    "DELETE FROM products WHERE product_id = ?",
    [productId]
  );
  return result;
};

const deleteMediaByProductId = async (productId) => {
  await db.execute("DELETE FROM media WHERE product_id = ?", [productId]);
};


module.exports = {
  createProduct,
  getAllProduct,
  getFilteredProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
  deleteProductById,
  deleteMediaByProductId
};
