import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure folders exist
const imageDir = "uploads/images";
const videoDir = "uploads/videos";
if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true });
if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, imageDir);
    } else if (file.mimetype.startsWith("video/")) {
      cb(null, videoDir);
    } else {
      cb(new Error("Only images and videos allowed"), false);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(null, `${baseName}-${Date.now()}${ext}`);
  }
});

// Filter only images & videos
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type! Only image/video allowed."), false);
  }
};

const upload = multer({ storage, fileFilter });
export default upload;
