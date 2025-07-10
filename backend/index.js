// Importing required modules and dependencies
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./src/config/db.config.js";
import authRoutes from "./src/routes/auth.routes.js";
import excelRoutes from "./src/routes/excel.routes.js"; 
import chartRoutes from "./src/routes/chart.routes.js";
import { errorHandler } from "./src/middleware/errorHandler.middleware.js";

// Initialize Express application
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());

// Middleware to handle Cross-Origin Resource Sharing (CORS)
app.use(cors({
  origin: "*", // Allow requests from any origin
  credentials: true, // Allow cookies to be sent with requests
}));

// Load environment variables from .env file
dotenv.config();

// Default route for the application
app.get("/", (req, res) => {
  res.send("Welcome to the Excel Analytics Platform!");
});

// Routes for authentication-related operations
app.use("/auth", authRoutes);

// Routes for Excel file handling operations
app.use("/excel", excelRoutes);

// Routes for chart-related operations
app.use("/charts", chartRoutes); 

// Global error handling middleware
app.use(errorHandler);

// Start the server and connect to the database
const port = process.env.PORT || 8080;
app.listen(port, () => {
  connectDB(); // Establish connection to the database
  console.log("Server is running on http://localhost:8080");
});
