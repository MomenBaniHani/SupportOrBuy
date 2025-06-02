const RoleModel = require("../Model/roleModel");

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await RoleModel.getAllRoles();
    res.json(roles);
  } catch (err) {
    console.error("❌ Error fetching roles:", err);
    res.status(500).json({ error: "Error fetching roles" });
  }
};

exports.createRole = async (req, res) => {
  try {
    const { name, key } = req.body;
    if (!name || !key) {
      return res.status(400).json({ error: "Please enter name and key" });
    }

    const newRole = await RoleModel.createRole({ name, key });
    res
      .status(201)
      .json({
        message: "✅ The role was created successfully.",
        role: newRole,
      });
  } catch (err) {
    console.error("❌ Error creating role:", err);
    res
      .status(500)
      .json({ error: "An error occurred while creating the role." });
  }
};

exports.getRolePermissions = async (req, res) => {
  try {
    const roleId = req.params.id;
    const permissions = await RoleModel.getRolePermissions(roleId);
    res.json(permissions);
  } catch (err) {
    console.error("❌ Error fetching role permissions:", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching permissions." });
  }
};

exports.assignPermission = async (req, res) => {
  try {
    const { role_id, permission_id } = req.body;
    if (!role_id || !permission_id) {
      return res.status(400).json({ error: "role_id و permission_id مطلوبان" });
    }

    await RoleModel.assignPermissionToRole(role_id, permission_id);
    res.json({
      message: "✅ The permission was successfully linked to the role.",
    });
  } catch (err) {
    console.error("❌ Error assigning permission:", err);
    res.status(500).json({ error: "Failed to link validity" });
  }
};
