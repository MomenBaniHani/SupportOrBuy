const UserModel = require("../Model/userModel");

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await UserModel.getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("❌ Error fetching profile:", err);
    res.status(500).json({ error: "Error fetching profile" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { first_name, last_name, phone, address, bio } = req.body;
    const profile_picture = req.file ? req.file.path : req.body.profile_picture;

    const updatedData = {
      first_name,
      last_name,
      phone,
      address,
      bio,
      profile_picture,
    };

    await UserModel.updateUserProfile(userId, updatedData);
    res.json({ message: "Data updated successfully" });
  } catch (err) {
    console.error("❌ Error updating profile:", err);
    res.status(500).json({ error: "Failed to modify data" });
  }
};

