const Support = require("../Model/supportModel");
const Notification = require("../Model/notificationModel");

exports.sendSupport = async (req, res) => {
  try {
    const supporter_id = req.user.id;
    const { artisan_id, product_id, amount, message } = req.body;
    const supporter_name = `${req.user.first_name} ${req.user.last_name}`;

    if (!artisan_id || !amount) {
      return res.status(400).json({
        error: "Please enter at least the artisan ID and the support amount.",
      });
    }

    const supportData = {
      supporter_id,
      supporter_name,
      artisan_id,
      product_id,
      amount,
      message,
    };

    const result = await Support.createSupport(supportData);
    const support_id = result.insertId;

    // إرسال إشعار للحرفي
    await Notification.createNotification(
      artisan_id,
      "support",
      support_id,
      `${supporter_name} supported your product with an amount of ${amount} د`
    );

    res.status(201).json({ message: "Support sent successfully" });
  } catch (err) {
    console.error("❌ Error sending support:", err);
    res
      .status(500)
      .json({ error: "Failed to send support", details: err.message });
  }
};


exports.getAllSupports = async (req, res) => {
  try {
    const rows = await Support.getAllSupports();
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching supports:", err);
    res.status(500).json({ error: "Failed to load support list" });
  }
};
