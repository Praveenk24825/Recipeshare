import multer from "multer";

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"), // files saved in uploads folder
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

// File filter: allow all files
const fileFilter = (req, file, cb) => {
  cb(null, true); // allow any file
};

const upload = multer({ storage, fileFilter });

export default upload;
