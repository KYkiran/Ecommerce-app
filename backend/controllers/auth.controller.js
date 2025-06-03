import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Token generators
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

// Store refresh token in Redis
const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60);
};

// Set tokens in cookies - FIXED VERSION
const setCookies = (res, accessToken, refreshToken) => {
  // Cookie options for development (Postman testing)
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set to false for development/HTTP
    sameSite: "strict" // Changed from "strict" to "lax" for better compatibility
  };

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
  
  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // For debugging - log that cookies are being set
  console.log("Setting cookies:", {
    accessToken: accessToken.substring(0, 20) + "...",
    refreshToken: refreshToken.substring(0, 20) + "...",
    options: cookieOptions
  });
};

// Signup
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const user = await User.create({ name, email, password });

    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({ message: error.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }
    if (!(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    console.log("Error in login controller", error);
    res.status(500).json({ message: error.message });
  }
};

// Logout - FIXED VERSION
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log("All cookies received:", req.cookies);
    console.log("Refresh token received:", refreshToken);

    // Even if no refresh token, we should still clear cookies
    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        await redis.del(`refresh_token:${decoded.userId}`);
        console.log("Refresh token removed from Redis for user:", decoded.userId);
      } catch (err) {
        console.error("Failed to verify refresh token for logout:", err.message);
      }
    }

    // Clear cookies with same options used to set them
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    console.log("Cookies cleared successfully");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};