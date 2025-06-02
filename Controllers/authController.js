const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Model/userModel");

exports.register = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      role_id,
      phone,
      address,
      profile_picture,
      bio,
    } = req.body;

    if (!first_name || !last_name || !email || !password || !role_id) {
      return res
        .status(400)
        .json({ error: "Please fill in all required fields." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      first_name,
      last_name,
      email,
      password_hash: hashedPassword,
      phone,
      address,
      profile_picture,
      bio,
      role_id,
    };

    await User.createUser(newUser);

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("❌ Error registering user:", err);
    res
      .status(500)
      .json({ error: "Error creating user", details: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please enter your email and password." });
    }

    const users = await User.findUserByEmail(email);
    if (!users || users.length === 0) {
      return res.status(401).json({ error: "Email not registered" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    const roleRow = await User.getRoleById(user.role_id);
    const role = roleRow?.role || "user";

    const token = jwt.sign(
      {
        id: user.user_id,
        role_id: user.role_id,
        role,
        first_name: user.first_name,
        last_name: user.last_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "You have successfully logged in.",
      token,
      user: {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        role_id: user.role_id,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Error during login:", err);
    res.status(500).json({ error: "Error while logging in" });
  }
};
