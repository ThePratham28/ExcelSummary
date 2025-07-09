import parseExcel from "../utils/excelParser.js";
import { ExcelData } from "../models/excelData.model.js";

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
    const file = await ExcelData.findOne({
      _id: req.params.id,
      user: req.userId,
    });
    if (!file) return res.status(404).json({ error: "File not found" });
    res.json(file);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserFiles = async (req, res) => {
  try {
    const files = await ExcelData.find({ user: req.userId })
      .select("filename uploadedAt")
      .sort({ uploadedAt: -1 });

    res.status(200).json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await ExcelData.findOneAndDelete({
      _id: id,
      user: req.userId,
    });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    res.status(200).json({ message: "File deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
