const db = require("../Config/db");

const addReview = async (review) => {
  const sql = `
    INSERT INTO reviews (user_id, product_id, order_id, rating, comment)
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [
    review.user_id,
    review.product_id,
    review.order_id || null,
    review.rating,
    review.comment || null,
  ];
  const [result] = await db.execute(sql, values);
  return result;
};

const getProductReviews = async (product_id) => {
  const sql = `
    SELECT r.review_id, r.rating, r.comment, r.created_at,
           CONCAT(u.first_name, ' ', u.last_name) AS reviewer_name
    FROM reviews r
    JOIN users u ON r.user_id = u.user_id
    WHERE r.product_id = ?
    ORDER BY r.created_at DESC
  `;
  const [rows] = await db.execute(sql, [product_id]);
  return rows;
};

const getAverageRating = async (product_id) => {
  const sql = `
    SELECT ROUND(AVG(rating), 1) AS average_rating, COUNT(*) AS total_reviews
    FROM reviews
    WHERE product_id = ?
  `;
  const [rows] = await db.execute(sql, [product_id]);
  return rows[0];
};

const hasAlreadyReviewedOrder = async (user_id, order_id) => {
  const [rows] = await db.execute(
    "SELECT 1 FROM reviews WHERE user_id = ? AND order_id = ?",
    [user_id, order_id]
  );
  return rows.length > 0;
};

const getProductOwnerId = async (product_id) => {
  const [rows] = await db.execute(
    "SELECT user_id FROM products WHERE product_id = ?",
    [product_id]
  );
  return rows.length > 0 ? rows[0].user_id : null;
};

const getAllReviews = async () => {
  const sql = `
    SELECT r.review_id, r.rating, r.comment, r.created_at,
           CONCAT(u.first_name, ' ', u.last_name) AS reviewer,
           p.title AS product_title
    FROM reviews r
    JOIN users u ON r.user_id = u.user_id
    JOIN products p ON r.product_id = p.product_id
    ORDER BY r.created_at DESC
  `;
  const [rows] = await db.execute(sql);
  return rows;
};

const deleteReviewById = async (reviewId) => {
  const [result] = await db.execute(
    "DELETE FROM reviews WHERE review_id = ?",
    [reviewId]
  );
  return result;
};

module.exports = {
  addReview,
  getProductReviews,
  getAverageRating,
  hasAlreadyReviewedOrder,
  getProductOwnerId,
  getAllReviews,
  deleteReviewById
};
