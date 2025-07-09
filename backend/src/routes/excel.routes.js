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

router.post("/upload", authMiddleware, multer.single("file"), uploadFile);
router.get("/:id", authMiddleware, getFileData);
router.get("/", authMiddleware, getUserFiles);
router.delete("/:id", authMiddleware, deleteFile);

export default router;
