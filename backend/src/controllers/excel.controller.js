import parseExcel from "../utils/excelParser.js";
import { ExcelData } from "../models/excelData.model.js";

export const uploadFile = async (req, res) => {
  const logger = res.locals.logger;
  const userId = req.userId;
  const filename = req.file?.originalname;

  logger.info("Processing Excel file upload", { userId, filename });

  try {
    const jsonData = parseExcel(req.file.buffer);
    const columns = Object.keys(jsonData[0]);

    logger.debug("Excel file parsed successfully", {
      userId,
      filename,
      rowCount: jsonData.length,
      columns,
    });

    const file = new ExcelData({
      user: userId,
      filename: filename,
      columns,
      data: jsonData,
    });

    await file.save();

    logger.info("Excel file uploaded successfully", {
      userId,
      filename,
      fileId: file._id,
      rowCount: jsonData.length,
    });

    res
      .status(200)
      .json({ message: "File uploaded", columns, fileId: file._id });
  } catch (err) {
    logger.error("Error uploading Excel file", {
      userId,
      filename,
      error: err.message,
      stack: err.stack,
    });

    res.status(500).json({ error: err.message });
  }
};

export const getFileData = async (req, res) => {
  const logger = res.locals.logger;
  const userId = req.userId;
  const fileId = req.params.id;

  logger.info("Retrieving Excel file data", { userId, fileId });

  try {
    const file = await ExcelData.findOne({
      _id: fileId,
      user: userId,
    });

    if (!file) {
      logger.warn("Excel file not found", { userId, fileId });
      return res.status(404).json({ error: "File not found" });
    }

    logger.info("Excel file data retrieved successfully", {
      userId,
      fileId,
      filename: file.filename,
    });

    res.json(file);
  } catch (err) {
    logger.error("Error retrieving Excel file data", {
      userId,
      fileId,
      error: err.message,
      stack: err.stack,
    });

    res.status(500).json({ error: err.message });
  }
};

export const getUserFiles = async (req, res) => {
  const logger = res.locals.logger;
  const userId = req.userId;

  logger.info("Retrieving user's Excel files", { userId });

  try {
    const files = await ExcelData.find({ user: userId })
      .select("filename uploadedAt")
      .sort({ uploadedAt: -1 });

    logger.info("User's Excel files retrieved successfully", {
      userId,
      fileCount: files.length,
    });

    res.status(200).json(files);
  } catch (err) {
    logger.error("Error retrieving user's Excel files", {
      userId,
      error: err.message,
      stack: err.stack,
    });

    res.status(500).json({ error: err.message });
  }
};

export const deleteFile = async (req, res) => {
  const logger = res.locals.logger;
  const userId = req.userId;
  const fileId = req.params.id;

  logger.info("Deleting Excel file", { userId, fileId });

  try {
    const file = await ExcelData.findOneAndDelete({
      _id: fileId,
      user: userId,
    });

    if (!file) {
      logger.warn("Excel file not found for deletion", { userId, fileId });
      return res.status(404).json({ error: "File not found" });
    }

    logger.info("Excel file deleted successfully", {
      userId,
      fileId,
      filename: file.filename,
    });

    res.status(200).json({ message: "File deleted successfully" });
  } catch (err) {
    logger.error("Error deleting Excel file", {
      userId,
      fileId,
      error: err.message,
      stack: err.stack,
    });

    res.status(500).json({ error: err.message });
  }
};
