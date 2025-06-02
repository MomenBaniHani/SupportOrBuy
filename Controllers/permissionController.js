const PermissionModel = require("../Model/permissionModel");

exports.getAllPermissions = async (req, res) => {
  try {
    const permissions = await PermissionModel.getAllPermissions();
    res.json(permissions);
  } catch (err) {
    console.error("❌ Error fetching permissions:", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching permissions." });
  }
};

exports.createPermission = async (req, res) => {
  try {
    const { key, description } = req.body;

    if (!key) {
      return res
        .status(400)
        .json({ error: "Please enter the authorization key" });
    }

    const newPermission = await PermissionModel.createPermission({
      key,
      description,
    });
    res
      .status(201)
      .json({
        message: "✅ The authorization was created successfully.",
        permission: newPermission,
      });
  } catch (err) {
    console.error("❌ Error creating permission:", err);
    res.status(500).json({ error: "Failed to create authorization" });
  }
};
