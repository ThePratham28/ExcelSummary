import { model, Schema, Types } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     ExcelData:
 *       type: object
 *       required:
 *         - user
 *       properties:
 *         user:
 *           type: string
 *           format: objectId
 *           description: Reference to the user who uploaded the file
 *         filename:
 *           type: string
 *           description: Name of the uploaded Excel file
 *         columns:
 *           type: array
 *           items:
 *             type: string
 *           description: Column headers from the Excel file
 *         data:
 *           type: array
 *           items:
 *             type: object
 *           description: Parsed Excel data as array of objects
 *         uploadedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the file was uploaded
 *       example:
 *         user: "60d21b4667d0d8992e610c85"
 *         filename: "sales_report_2025.xlsx"
 *         columns: ["Date", "Product", "Region", "Sales", "Profit"]
 *         data: [
 *           {"Date": "2025-01-01", "Product": "Widget A", "Region": "North", "Sales": 1500, "Profit": 300},
 *           {"Date": "2025-01-02", "Product": "Widget B", "Region": "South", "Sales": 2000, "Profit": 450}
 *         ]
 *         uploadedAt: "2025-07-10T12:00:00.000Z"
 */
const ExcelDataSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    filename: String,
    columns: [String],
    data: [{}],
    uploadedAt: { type: Date, default: Date.now },
  },
  { strict: false }
);

export const ExcelData = model("ExcelData", ExcelDataSchema);
