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

router.post("/upload", authMiddleware("user"), multer.single("file"), uploadFile); 
router.get("/:id", authMiddleware("user"), getFileData);
router.get("/", authMiddleware("user"), getUserFiles); 
router.delete("/:id", authMiddleware("user"), deleteFile);

export default router;
