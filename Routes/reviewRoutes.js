const express = require("express");
const router = express.Router();
const reviewController = require("../Controllers/reviewController");
const { verifyToken } = require("../Middlewares/authMiddleware");
const { checkPermission } = require("../Middlewares/permissionMiddleware"); // تعديل Roles and Permissions

// إضافة تقييم
router.post(
  "/",
  verifyToken,
  checkPermission("add_review"), // تعديل Roles and Permissions
  reviewController.addReview
);

// عرض تقييمات منتج
router.get("/product/:id", reviewController.getReviewsByProduct);

// عرض المتوسط
router.get("/product/:id/average", reviewController.getAverageRating);

// للإدمن: عرض كل التقييمات
router.get(
  "/",
  verifyToken,
  checkPermission("view_reviews"),
  reviewController.getAllReviews
);

// للإدمن: حذف تقييم
router.delete(
  "/:id",
  verifyToken,
  checkPermission("delete_review"),
  reviewController.deleteReview
);


module.exports = router;
