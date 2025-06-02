const product = require("../Model/productModel");
const mediaModel = require("../Model/mediaModel");

exports.createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      category,
      product_type,
      is_for_sale,
      is_for_support,
      support_description,
      support_amount,
    } = req.body;

    const newProduct = {
      user_id: req.user.id,
      title,
      description,
      price: price || null,
      category,
      product_type,
      is_for_sale,
      is_for_support,
      support_description: support_description || "",
      support_amount: support_amount || null,
    };

    const result = await product.createProduct(newProduct);

    if (req.file) {
      const imagePath = req.file.path.replace(/\\/g, "/");
      await mediaModel.insertProductImage(result.insertId, imagePath, true);
    }

    res.status(201).json({
      message: "The product was created successfully.",
      product_id: result.insertId,
    });
  } catch (err) {
    console.error("❌ DB ERROR:", err);
    res.status(500).json({ error: "Failed to add product" });
  }
};

exports.getAllProduct = async (req, res) => {
  try {
    const result = await product.getAllProduct();
    res.json(result);
  } catch (err) {
    console.error("❌ DB ERROR:", err);
    res.status(500).json({ error: "Error while fetching products" });
  }
};

exports.getFilteredProducts = async (req, res) => {
  try {
    const filters = {
      user_id: req.query.user_id,
      category: req.query.category,
      order: req.query.order,
      type: req.query.type, // ✅ الحل هنا
    };

    const result = await product.getFilteredProducts(filters);
    res.json(result);
  } catch (err) {
    console.error("❌ DB ERROR:", err);
    res.status(500).json({ error: "Error while filtering products" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await product.getProductById(id);

    if (!result) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(result);
  } catch (err) {
    console.error("❌ DB ERROR:", err);
    res.status(500).json({ error: "Error fetching product" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id;

    const {
      title,
      description,
      price,
      category,
      product_type,
      is_for_sale,
      is_for_support,
      support_description,
      support_amount,
    } = req.body;

    const updatedData = {
      title,
      description,
      price: price || null,
      category,
      product_type,
      is_for_sale: is_for_sale == "1" || is_for_sale === true,
      is_for_support: is_for_support == "1" || is_for_support === true,
      support_description,
      support_amount: support_amount || null,
    };

    const result = await product.updateProduct(productId, userId, updatedData);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "The product is not available or not for you" });
    }

    if (req.file) {
      const imagePath = req.file.path.replace(/\\/g, "/");
      await mediaModel.deleteImagesByProductId(productId);
      await mediaModel.insertProductImage(productId, imagePath, true);
    }

    res.json({ message: "The product has been updated successfully." });
  } catch (err) {
    console.error("❌ Error updating product:", err);
    res.status(500).json({ error: "Product update failed" });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id;
    const role = req.user.role; // ← تأكد أنك تمرر role داخل التوكن

    let result;
    if (role === 'admin') {
      // حذف بدون شرط المالك
      await product.deleteMediaByProductId(productId); // حذف الصور
      result = await product.deleteProductById(productId);
    } else {
      // حذف فقط إذا هو المالك
      result = await product.deleteProduct(productId, userId);
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "The product was not found or you do not have permission to delete it.",
      });
    }

    res.json({ message: "The product has been successfully deleted." });
  } catch (err) {
    console.error("❌ Error deleting product:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
};


exports.searchProducts = async (req, res) => {
  try {
    const result = await product.searchProducts(req.query);

    res.json(result);
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getMyProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await product.getFilteredProducts({ user_id: userId });

    res.json(result); // ← يرجّع قائمة المنتجات (حتى لو كانت فاضية)
  } catch (err) {
    console.error("❌ Error fetching my products:", err);
    res.status(500).json({ error: "Failed to fetch user products" });
  }
};
