const path = require("path");
const MediaModel = require("../Model/mediaModel");

exports.uploadProductImage = async (req, res) => {
  try {
    const { product_id, is_primary } = req.body;
    const imageFile = req.file;

    if (!imageFile || !product_id) {
      return res.status(400).json({ error: "Missing image or product_id" });
    }

    const imageUrl = `uploads/products/${imageFile.filename}`;
    const isPrimary = is_primary === "true";

    await MediaModel.insertProductImage(
      Number(product_id),
      imageUrl,
      isPrimary
    );

    res.status(201).json({
      message: "Image uploaded successfully",
      image_url: imageUrl,
    });
  } catch (err) {
    console.error(">> uploadProductImage Error:", err.message);
    res.status(500).json({ error: "Error uploading image" });
  }
};

exports.getProductImages = async (req, res) => {
  try {
    const productId = Number(req.params.productId);
    if (!productId) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const images = await MediaModel.getImagesByProductId(productId);
    res.status(200).json(images);
  } catch (err) {
    console.error(">> getProductImages Error:", err.message);
    res.status(500).json({ error: "Error fetching images" });
  }
};
