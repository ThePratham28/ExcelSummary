import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import multer from "../config/multer.config.js";
import {
  deleteFile,
  getFileData,
  getUserFiles,
  uploadFile,
} from "../controllers/excel.controller.js";

const router = Router();

/**
 * @swagger
 * /excel/upload:
 *   post:
 *     summary: Upload an Excel file
 *     tags: [Excel]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Excel file (.xls or .xlsx)
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 columns:
 *                   type: array
 *                   items:
 *                     type: string
 *                 fileId:
 *                   type: string
 *       400:
 *         description: Invalid file format
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  "/upload",
  authMiddleware("user"),
  multer.single("file"),
  uploadFile
);

/**
 * @swagger
 * /excel/{id}:
 *   get:
 *     summary: Get specific Excel file data
 *     tags: [Excel]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Excel file ID
 *     responses:
 *       200:
 *         description: Excel file data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: File not found
 *       500:
 *         description: Server error
 */
router.get("/:id", authMiddleware("user"), getFileData);

/**
 * @swagger
 * /excel:
 *   get:
 *     summary: Get all user's Excel files
 *     tags: [Excel]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of user's Excel files
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   filename:
 *                     type: string
 *                   uploadedAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", authMiddleware("user"), getUserFiles);

/**
 * @swagger
 * /excel/{id}:
 *   delete:
 *     summary: Delete an Excel file
 *     tags: [Excel]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Excel file ID
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: File not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", authMiddleware("user"), deleteFile);

export default router;
