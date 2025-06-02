const db = require("../Config/db");

// إدخال صورة منتج جديدة
const insertProductImage = async (product_id, image_url, is_primary) => {
  try {
    const result = await db.execute(
      `INSERT INTO media (product_id, image_url, is_primary) VALUES (?, ?, ?)`,
      [product_id, image_url, is_primary]
    );
    return result;
  } catch (err) {
    console.error(">> mediaModel Insert Error:", err.message);
    throw err;
  }
};

// جلب صور منتج معين
const getImagesByProductId = async (product_id) => {
  try {
    const [rows] = await db.execute(
      `SELECT * FROM media WHERE product_id = ?`,
      [product_id]
    );
    return rows;
  } catch (err) {
    console.error(">> mediaModel Fetch Error:", err.message);
    throw err;
  }
};

// حذف صور منتج
const deleteImagesByProductId = async (product_id) => {
  try {
    const result = await db.execute(`DELETE FROM media WHERE product_id = ?`, [
      product_id,
    ]);
    return result;
  } catch (err) {
    console.error(">> mediaModel Delete Error:", err.message);
    throw err;
  }
};

// تصدير جميع الدوال
module.exports = {
  insertProductImage,
  getImagesByProductId,
  deleteImagesByProductId,
};
