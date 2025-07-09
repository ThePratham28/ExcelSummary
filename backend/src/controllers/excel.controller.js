import { ExcelData } from "../models/excelData.model.js";
import parseExcel from "../utils/excelParser.js";

export const uploadFile = async (req, res) => {
  try {
    const jsonData = parseExcel(req.file.buffer);
    const columns = Object.keys(jsonData[0]);

    const file = new ExcelData({
      user: req.userId,
      filename: req.file.originalname,
      columns,
      data: jsonData,
    });

    await file.save();
    res
      .status(200)
      .json({ message: "File uploaded", columns, fileId: file._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFileData = async (req, res) => {
  try {
    const jsonData = parseExcel(req.file.buffer);
    const columns = Object.keys(jsonData[0]);

    const file = new ExcelData({
      user: req.userId,
      filename: req.file.originalname,
      columns,
      data: jsonData,
    });

    await file.save();
    res
      .status(200)
      .json({ message: "File uploaded", columns, fileId: file._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
