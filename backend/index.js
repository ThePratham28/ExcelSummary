// Importing required modules and dependencies
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { connectDB } from "./src/config/db.config.js";
import authRoutes from "./src/routes/auth.routes.js";
import excelRoutes from "./src/routes/excel.routes.js";
import chartRoutes from "./src/routes/chart.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import { errorHandler } from "./src/middleware/errorHandler.middleware.js";
import logger, {
  requestContext,
  requestLogger,
} from "./src/utils/winstonLogger.js";
import swaggerSpec from "./src/config/swagger.config.js";

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());

// Add request context and logging middleware
app.use(requestContext);
app.use(requestLogger);

// Middleware to handle Cross-Origin Resource Sharing (CORS)
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true, // Allow cookies to be sent with requests
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
  res.locals.logger.info("Health check endpoint accessed");
});

// Default route for the application
app.get("/", (req, res) => {
  res.locals.logger.info("Home route accessed");
  res.send("Welcome to the Excel Analytics Platform!");
});

// Routes for authentication-related operations
app.use("/auth", authRoutes);

// Routes for Excel file handling operations
app.use("/excel", excelRoutes);

// Routes for chart-related operations
app.use("/charts", chartRoutes);

// Routes for admin-related operations
app.use("/admin", adminRoutes);

// Global error handling middleware
app.use(errorHandler);

// Start the server and connect to the database
const port = process.env.PORT;
app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
  connectDB();
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception", {
    error: error.message,
    stack: error.stack,
  });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection", {
    reason: reason instanceof Error ? reason.message : reason,
    stack: reason instanceof Error ? reason.stack : "No stack trace",
  });
});
