const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const mediaController = require("../Controllers/mediaController");
const { verifyToken } = require("../Middlewares/authMiddleware"); // تعديل Roles and Permissions
const { checkPermission } = require("../Middlewares/permissionMiddleware"); // تعديل Roles and Permissions

// إعداد التخزين
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/products/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage });

// رفع صورة منتج
router.post(
  "/upload",
  verifyToken, // تعديل Roles and Permissions
  checkPermission("upload_product_image"), // تعديل Roles and Permissions
  upload.single("image"),
  mediaController.uploadProductImage
);

// عرض صور منتج
router.get("/product/:productId", mediaController.getProductImages);

module.exports = router;
