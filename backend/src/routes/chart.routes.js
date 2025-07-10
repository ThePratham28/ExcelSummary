import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  exportChartData,
  getChartDetails,
  getChartSuggestions,
} from "../controllers/chart.controller.js";

const router = Router();

/**
 * @swagger
 * /charts/data/{fileId}:
 *   post:
 *     summary: Get chart details for a specific Excel file
 *     tags: [Charts]
 *     security:
 *       - cookieAuth: []
 *     description: Retrieves chart data for a specific Excel file. Requires user authentication.
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the Excel file to get chart data for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - xAxis
 *               - yAxis
 *               - chartType
 *             properties:
 *               title:
 *                 type: string
 *               xAxis:
 *                 type: string
 *               yAxis:
 *                 type: string
 *               chartType:
 *                 type: string
 *     responses:
 *       200:
 *         description: Chart data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   description: Processed data suitable for charting
 *                 columns:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Column names from the Excel file
 *                 numericColumns:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Names of columns containing numeric data
 *                 categoricalColumns:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Names of columns containing categorical data
 *       401:
 *         description: Unauthorized - Not logged in
 *       404:
 *         description: File not found
 *       500:
 *         description: Server error
 */
router.post("/data/:fileId", authMiddleware("user"), getChartDetails);

/**
 * @swagger
 * /charts/suggestions/{fileId}:
 *   get:
 *     summary: Get chart type suggestions for a specific Excel file
 *     tags: [Charts]
 *     security:
 *       - cookieAuth: []
 *     description: Analyzes the Excel file data and returns recommended chart types based on the data structure. Requires user authentication.
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the Excel file to analyze
 *     responses:
 *       200:
 *         description: Chart suggestions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   chartType:
 *                     type: string
 *                     example: "bar"
 *                     description: Suggested chart type (e.g., bar, line, pie)
 *                   suitabilityScore:
 *                     type: number
 *                     example: 0.85
 *                     description: Score indicating how suitable this chart type is (0-1)
 *                   recommendedColumns:
 *                     type: object
 *                     properties:
 *                       x:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: Recommended columns for X-axis
 *                       y:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: Recommended columns for Y-axis
 *                   reason:
 *                     type: string
 *                     description: Explanation for why this chart type is recommended
 *       401:
 *         description: Unauthorized - Not logged in
 *       404:
 *         description: File not found
 *       500:
 *         description: Server error
 */
router.get("/suggestions/:fileId", authMiddleware("user"), getChartSuggestions);

/**
 * @swagger
 * /charts/data-export/{fileId}:
 *   get:
 *     summary: Export chart data for a specific Excel file
 *     tags: [Charts]
 *     security:
 *       - cookieAuth: []
 *     description: Exports chart data in a format suitable for external visualization tools. Requires user authentication.
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the Excel file to export chart data for
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, csv]
 *           default: json
 *         description: Export format (json or csv)
 *     responses:
 *       200:
 *         description: Chart data exported successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *           text/csv:
 *             schema:
 *               type: string
 *       401:
 *         description: Unauthorized - Not logged in
 *       404:
 *         description: File not found
 *       500:
 *         description: Server error
 */
router.get("/data-export/:fileId", authMiddleware("user"), exportChartData);

export default router;
