const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User.M");
const sendMail = require("../utils/SendMail");

const otps = new Map();
const JWT_SECRET = process.env.JWT_SECRET || "private-key";

const Signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "email and password are required" });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(403).json({ msg: "user already registered" });
    }

    const hash = await bcrypt.hash(password, 10);
    // use 'password' field (match model)
    const userPayload = { ...req.body, password: hash };

    const user = await User.create(userPayload);

    const data = {
      email: user.email,
      id: user.id,
      role: user.role,
      name: user.name,
    };

    const token = jwt.sign(data, JWT_SECRET, { expiresIn: "7d" });

    const otp = Math.floor(1000 + Math.random() * 9000); // 4-digit OTP
    otps.set(email, otp);

    const html = `<div>
      <h1>Hello ${user.name || user.email}</h1>
    </div>`;

    try {
      await sendMail(email, "verify", html);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }

    return res.status(201).json({
      msg: "user created",
      token
    });
  } catch (error) {
    return res.status(500).json({ msg: "err", error: error.message });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "email and password required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ msg: "user not found" });

    // compare with 'password' field
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: "invalid password" });

    const data = {
      email: user.email,
      id: user.id,
      role: user.role,
      name: user.name,
      isActive: user.isActive,
    };

    const token = jwt.sign(data, JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({
      msg: "user loggedIn",
      token,
      isVerified: user.isVerified ?? false,
      isActive: user.isActive,
    });
  } catch (error) {
    return res.status(500).json({ msg: "err", error: error.message });
  }
};

const GetUserByid = async (req, res) => {
  try {
    const { userid } = req.params;
    const user = await User.findByPk(userid, { attributes: { exclude: ["passw"] } });
    if (!user) return res.status(404).json({ msg: "user not found" });
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ msg: "user not found" });
    return res.status(200).json({ msg: "user deleted" });
  } catch (error) {
    return res.status(500).json({ msg: "error deleting user", error: error.message });
  }
};

const getAdmins = async (req, res) => {
  try {
    const admins = await User.findAll({
      where: { role: "ADMIN" },
      attributes: { exclude: ["passw"] },
    });
    return res.status(200).json(admins);
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};

// Toggle isActive for a user (admin route)
const toggleUserActiveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ msg: "user not found" });

    user.isActive = !user.isActive;
    await user.save();

    return res.status(200).json({ msg: "status updated", id: user.id, isActive: user.isActive });
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};

// OPTIONAL: endpoint for verifying token+otp from signup link
const verifyWithTokenOtp = async (req, res) => {
  try {
    const { token, otp } = req.params;
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) return res.status(403).json({ msg: "invalid token" });

    const oldOtp = otps.get(decoded.email);
    if (String(oldOtp) !== String(otp)) return res.status(400).json({ msg: "invalid otp" });

    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ msg: "user not found" });

    await user.update({ isVerified: true });
    otps.delete(decoded.email);

    return res.status(200).json({ msg: "verified", data: { id: user.id, isVerified: true } });
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};

module.exports = {
  Signup,
  Login,
  GetUserByid,
  deleteUser,
  getAdmins,
  toggleUserActiveStatus,
  verifyWithTokenOtp,
};
