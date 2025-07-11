import { hash, verify } from "argon2";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";

const TOKEN_EXPIRY = "6h";
const COOKIE_MAX_AGE = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Prevent CSRF attacks
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    maxAge: COOKIE_MAX_AGE,
  });
};

export const registerUser = async (req, res) => {
  const { username, email, password, role = "user" } = req.body;
  const logger = res.locals.logger;

  if (!username || !email || !password) {
    logger.warn("Registration failed: missing required fields", { email });
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const userExists = await UserModel.findOne({ email });

    if (userExists) {
      logger.warn("Registration failed: user already exists", { email });
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await hash(password);
    logger.debug("Password hashed successfully");

    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    logger.info("User registered successfully", { userId: newUser._id, email });

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: TOKEN_EXPIRY,
      }
    );

    setAuthCookie(res, token);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    logger.error("Error during registration", {
      error: error.message,
      stack: error.stack,
      email,
    });
    res.status(500).json({ message: "Server Error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const logger = res.locals.logger;

  if (!email || !password) {
    logger.warn("Login failed: missing required fields", { email });
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      logger.warn("Login failed: user not found", { email });
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const validPassword = await verify(user.password, password);

    if (!validPassword) {
      logger.warn("Login failed: invalid password", {
        userId: user._id,
        email,
      });
      return res.status(400).json({ message: "Invalid email or password" });
    }

    logger.info("User logged in successfully", { userId: user._id, email });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: TOKEN_EXPIRY,
      }
    );

    setAuthCookie(res, token);
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    logger.error("Error during login", {
      error: error.message,
      stack: error.stack,
      email,
    });
    res.status(500).json({ message: "Server Error" });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ message: "Logout successful" });
};

export const userProfile = async (req, res) => {
  const logger = res.locals.logger;
  const userId = req.userId; // Get userId from authMiddleware

  try {
    const user = await UserModel.findById(userId).select("-password");

    if (!user) {
      logger.warn("Profile access failed: user not found", {
        userId,
      });
      return res.status(404).json({ message: "User not found" });
    }

    logger.info("User profile accessed", { userId: user._id });
    res.status(200).json(user);
  } catch (error) {
    logger.error("Error fetching profile", {
      userId,
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({ message: "Server Error" });
  }
};
