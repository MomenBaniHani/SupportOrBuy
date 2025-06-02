const express = require("express");
const router = express.Router();
const orderController = require("../Controllers/orderController");
const { verifyToken } = require("../Middlewares/authMiddleware");
const { checkPermission } = require("../Middlewares/permissionMiddleware"); // تعديل Roles and Permissions

router.post(
  "/",
  verifyToken,
  checkPermission("place_order"), // تعديل Roles and Permissions
  orderController.createOrder
);

router.get(
  "/my",
  verifyToken,
  checkPermission("view_my_orders"), // تعديل Roles and Permissions
  orderController.getMyOrders
);

router.get(
  "/incoming",
  verifyToken,
  checkPermission("view_incoming_orders"), // تعديل Roles and Permissions
  orderController.getIncomingOrders
);

router.put(
  "/:id/status",
  verifyToken,
  checkPermission("update_order_status"), // تعديل Roles and Permissions
  orderController.updateOrderStatus
);

router.delete(
  "/:id",
  verifyToken,
  checkPermission("cancel_order"), // تعديل Roles and Permissions
  orderController.cancelOrder
);

router.get(
  "/:id/history",
  verifyToken,
  checkPermission("view_order_history"), // تعديل Roles and Permissions
  orderController.getOrderHistory
);

router.get(
  "/all",
  verifyToken,
  checkPermission("order_view_all"),
  orderController.getAllOrders
);

module.exports = router;
