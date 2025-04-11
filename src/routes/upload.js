import express from "express";
import multer from "multer";
import { UploadController } from "../controllers/uploadController";
const uploadRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ được upload file ảnh!'), false);
    }
  },
});

const validateUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  next();
};

uploadRouter.post(
  "/",
  upload.single("file"),
  validateUpload,
  UploadController.uploadImage
);
uploadRouter.post("/delete", UploadController.deleteImage);


export default uploadRouter;
