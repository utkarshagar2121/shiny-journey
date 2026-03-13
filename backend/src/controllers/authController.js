import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User-Model.js";
import RefreshToken from "../models/refreshToken.js"; // ✅ correct import path

const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

// ================= SIGNUP =================
export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const error = new Error("All fields are required");
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    message: "Signup successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

// ================= LOGIN =================
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  console.log(password);

  if (!email || !password) {
    const error = new Error("Email and password required");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const error = new Error("Wrong password");
    error.statusCode = 400;
    throw error;
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  await RefreshToken.create({
    userId: user._id,
    token: refreshToken,
  });

  res.json({
    message: "Login successful",
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

// ================= REFRESH =================
export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    const error = new Error("Refresh token required");
    error.statusCode = 400;
    throw error;
  }

  const storedToken = await RefreshToken.findOne({ token: refreshToken });
  if (!storedToken) {
    const error = new Error("Invalid refresh token");
    error.statusCode = 403;
    throw error;
  }

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const newAccessToken = generateAccessToken(decoded.id);

  res.json({
    // ✅ actually sends the response now
    message: "Token refreshed",
    accessToken: newAccessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

// ================= LOGOUT =================
export const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    const error = new Error("Refresh token required");
    error.statusCode = 400;
    throw error;
  }

  await RefreshToken.findOneAndDelete({ token: refreshToken });

  res.json({ message: "Logout successful" });
});
