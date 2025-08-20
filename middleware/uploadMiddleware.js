import multer from 'multer';
import path from 'path';

// Storage config - store locally in "uploads/" folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // folder must exist
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // e.g., 1234567890.jpg
  },
});

// Accept images and videos only
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith('image/') ||
    file.mimetype.startsWith('video/')
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and videos allowed.'), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
