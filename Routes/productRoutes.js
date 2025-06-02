const express = require("express");
const router = express.Router();
const productController = require("../Controllers/productController");
const { verifyToken } = require("../Middlewares/authMiddleware");
const { checkPermission } = require("../Middlewares/permissionMiddleware");
const upload = require("../Middlewares/upload");

// إضافة منتج - يتطلب create_product
router.post(
  "/",
  verifyToken,
  checkPermission("create_product"),
  upload.single("image"), // ⬅️ مهم عشان multer يفهم الصورة ويقرأ body
  productController.createProduct
);

// جلب كل المنتجات بدون فلترة (للاستخدام الإداري مثلًا)
router.get(
  "/all",
  verifyToken,
  checkPermission("view_all_products"),
  productController.getAllProduct
);

// عرض كل المنتجات
router.get("/", productController.getFilteredProducts);
router.get("/search", productController.searchProducts);
// جلب منتج

router.get("/mine", verifyToken, productController.getMyProducts);

router.get("/:id", productController.getProductById);

// تحديث منتج - يتطلب edit_product
router.put(
  "/:id",
  verifyToken,
  checkPermission("edit_product"),
  upload.single("image"),
  productController.updateProduct
);

// حذف منتج - يتطلب delete_product
router.delete(
  "/:id",
  verifyToken,
  checkPermission("delete_product"),
  productController.deleteProduct
);

//router.get("/search", verifyToken, productController.searchProducts);

// منتجات المستخدم نفسه

module.exports = router;
