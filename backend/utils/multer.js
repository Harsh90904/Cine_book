const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload folder exists
const uploadDir = path.join(__dirname, "../uploads/thater");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({
  storage,
});

module.exports = upload;
