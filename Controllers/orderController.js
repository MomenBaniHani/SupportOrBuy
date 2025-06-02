const Order = require("../Model/orderModel");
const Notification = require("../Model/notificationModel");
const User = require("../Model/userModel");

exports.createOrder = async (req, res) => {
  const customer_id = req.user.id;
  const { artisan_id, products } = req.body;

  if (
    !artisan_id ||
    !products ||
    !Array.isArray(products) ||
    products.length === 0
  ) {
    return res
      .status(400)
      .json({ error: "Please enter the required craftsmanship and products." });
  }

  try {
    const productIds = products.map((p) => p.product_id);
    const rows = await Order.getProductPricesByIds(productIds);

    const priceMap = {};
    rows.forEach((row) => {
      priceMap[row.product_id] = parseFloat(row.price);
    });

    const items = [];
    let total = 0;

    for (const p of products) {
      const unit_price = priceMap[p.product_id];
      const quantity = p.quantity;
      const item_total = unit_price * quantity;
      total += item_total;

      items.push({
        product_id: p.product_id,
        quantity,
        unit_price,
      });
    }

    const orderData = {
      customer_id,
      artisan_id,
      total_amount: total,
    };

    const { orderId } = await Order.createOrder(orderData, items);

    // ⬇️ إرسال إشعار للحرفي
    // ⬇️ إرسال إشعار للحرفي
    const customer = await User.getUserById(customer_id);
    const customerName = `${customer.first_name} ${customer.last_name}`;
    await Notification.createNotification(
      artisan_id,
      "order",
      orderId,
      `${customerName} made a purchase order worth ${total.toFixed(2)} د`
    );



    res.status(201).json({ message: "The request was created successfully." });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res
      .status(500)
      .json({
        error: "An error occurred while processing the request.",
        details: error.message,
      });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const customer_id = req.user.id;
    const orders = await Order.getOrdersByCustomer(customer_id);
    res.json({ orders });
  } catch (err) {
    console.error("❌ Error fetching customer orders:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch requests", details: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    const userId = req.user.id;

    const allowedStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Not allowed status" });
    }

    const order = await Order.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({ error: "The request does not exist" });
    }

    const userRole = req.user.role_id; // تأكد أنك ترسل الـ role_id بالتوكن

    if (userRole !== 1 && order.artisan_id !== userId) {
      return res
        .status(403)
        .json({ error: "You are not allowed to modify this order." });
    }

    await Order.updateStatus(orderId, status);
    await Order.addOrderStatusHistory(orderId, status);

    const customer = await User.getUserById(order.customer_id);

    await Notification.createNotification(
      order.customer_id,
      "UpdateStatus",
      orderId,
      `Your order status has been updated to : ${status}`
    );

    res.status(200).json({ message: "Order status updated successfully" });
  } catch (err) {
    console.error("❌ Error updating order status:", err);
    res
      .status(500)
      .json({ error: "Failed to update status", details: err.message });
  }
};

exports.getIncomingOrders = async (req, res) => {
  try {
    const artisan_id = req.user.id;
    const orders = await Order.getIncomingOrdersByArtisan(artisan_id);
    res.json({ orders });
  } catch (err) {
    console.error("❌ Error fetching incoming orders:", err);
    res
      .status(500)
      .json({
        error: "Failed to fetch incoming requests",
        details: err.message,
      });
  }
};

exports.cancelOrder = async (req, res) => {
  const customer_id = req.user.id;
  const orderId = req.params.id;

  try {
    const result = await Order.cancelOrderIfPending(orderId, customer_id);

    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }

    res.json({ message: "The request was successfully cancelled." });
  } catch (error) {
    console.error("❌ Error canceling order:", error);
    res
      .status(500)
      .json({ error: "Failed to cancel the request", details: error.message });
  }
};

exports.getOrderHistory = async (req, res) => {
  try {
    const order_id = req.params.id;
    const userId = req.user.id;

    const order = await Order.getOrderById(order_id);

    if (!order) {
      return res.status(404).json({ error: "The request does not exist" });
    }

    // 🔐 السماح فقط للزبون أو الحرفي
    if (order.artisan_id !== userId && order.customer_id !== userId) {
      return res
        .status(403)
        .json({ error: "You are not allowed to view this request history." });
    }

    const history = await Order.getOrderStatusHistory(order_id);
    res.json({ history });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch request record", details: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.getAllOrders();
    res.json({ orders });
  } catch (err) {
    console.error("❌ Error fetching all orders:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch requests", details: err.message });
  }
};
