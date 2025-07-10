import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext !== ".xls" && ext !== ".xlsx") {
    return cb(new Error("Only Excel files are allowed"), false);
  }
  cb(null, true);
};

export default multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}); // 5MB limit
