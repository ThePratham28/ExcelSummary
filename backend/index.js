import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./src/config/db.config.js";
import authRoutes from "./src/routes/auth.routes.js";

const app = express(); // 

app.use(express.json());
app.use(cookieParser()); // Middleware to parse cookies

dotenv.config();

app.get("/", (req, res) => {
  res.send("Welcome to the Express.js and MongoDB application!");
});

app.use("/auth", authRoutes); // Authentication routes
// app.use("/excel", excelRoutes); // Excel file handling routes

const port = process.env.PORT || 8080;
app.listen(port, () => {
  connectDB();
  console.log("Server is running on http://localhost:8080");
});
