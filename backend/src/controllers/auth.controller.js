import { hash, verify } from "argon2";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";

const TOKEN_EXPIRY = "6h";
const COOKIE_MAX_AGE = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "Strict", // Prevent CSRF attacks
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    maxAge: COOKIE_MAX_AGE,
  });
};

export const registerUser = async (req, res) => {
  const { username, email, password, role = "user" } = req.body; // {username: sanket, emai: ddd, password: ddd, role: user}

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const userExists = await UserModel.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await hash(password); // Hash the password before saving

    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword, // Store the hashed password
      role,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: TOKEN_EXPIRY,
    });

    setAuthCookie(res, token); // Set the authentication cookie
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const validPassword = await verify(user.password, password); // Verify the password

    if (!validPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: TOKEN_EXPIRY,
    });

    setAuthCookie(res, token); // Set the authentication cookie
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const userProfile = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await UserModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
