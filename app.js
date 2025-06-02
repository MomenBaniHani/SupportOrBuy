/* require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const rateLimit = require("express-rate-limit");
const app = express();
const authRoutes = require("./Routes/authRoutes");
const productRoutes = require("./Routes/productRoutes");
const mediaRoutes = require("./Routes/mediaRoutes");
const userRoutes = require("./Routes/userRoutes");
const reviewRoutes = require("./Routes/reviewRoutes");
const orderRoutes = require("./Routes/orderRoutes");
const supportRoutes = require("./Routes/supportRoutes");
const notificationsRoutes = require("./Routes/notificationRoutes");
const roleRoutes = require("./Routes/roleRoutes");
const permissionRoutes = require("./Routes/permissionRoutes");
const adminRoutes = require("./Routes/adminRoutes");

// Middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "Views")));
app.use("/uploads", express.static("uploads"));



const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 دقيقة
  max: 100, // 100 طلب لكل IP خلال 5 دقيقة
  message: "🚫 Too many requests from this IP, please try again later.",
});

// Main route (login page)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Views", "welcome.html"));
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/user", userRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/admin", adminRoutes);
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "Views", "admin.html"));
});
// 404 route not found handler
app.use((req, res, next) => {
  res.status(404).json({ error: "❌ Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Unexpected error:", err);
  res.status(500).json({ error: "🔥 Internal server error" });
});
app.use(limiter);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
 */
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const rateLimit = require("express-rate-limit");

const app = express();
const authRoutes = require("./Routes/authRoutes");
const productRoutes = require("./Routes/productRoutes");
const mediaRoutes = require("./Routes/mediaRoutes");
const userRoutes = require("./Routes/userRoutes");
const reviewRoutes = require("./Routes/reviewRoutes");
const orderRoutes = require("./Routes/orderRoutes");
const supportRoutes = require("./Routes/supportRoutes");
const notificationsRoutes = require("./Routes/notificationRoutes");
const roleRoutes = require("./Routes/roleRoutes");
const permissionRoutes = require("./Routes/permissionRoutes");
const adminRoutes = require("./Routes/adminRoutes");

// Middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "Views")));
app.use("/uploads", express.static("uploads"));

// ✅ Rate Limiting قبل كل الراوتات
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 دقائق
  max: 100, // 100 طلب لكل IP خلال 5 دقائق
  message: "🚫 Too many requests from this IP, please try again later.",
});
app.use(limiter);


// Main route (login page)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Views", "welcome.html"));
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/user", userRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/admin", adminRoutes);
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "Views", "admin.html"));
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: "❌ Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Unexpected error:", err);
  res.status(500).json({ error: "🔥 Internal server error" });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
