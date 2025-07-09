import { Router } from "express";
import { upload } from "../config/multer.config.js";
import { parseExcelFile } from "../utils/excelParser.js";
import { ExcelData } from "../models/exelData.model.js";

const router = Router();

router.post("/upload", upload.single(file), async (req, res) => {
    try {
        const fileUrl = req.file.path; // Cloudinary URL of the uploaded file
        const parsedData = parseExcelFile(fileUrl); // Parse the Excel file

        await ExcelData.create(parsedData); // Save parsed data to MongoDB

        res.status(200).json({
            message: "File uploaded and data saved successfully",
            data: parsedData,
        });
    } catch (error) {
        console.error("Error processing file:", error.message);
        res.status(500).json({ message: "Server Error" });
    }
});
