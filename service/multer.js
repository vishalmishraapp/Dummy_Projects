const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destPath = "./upload";
    cb(null, destPath);
  },

  filename: (req, file, cb) => {
    const filename = Date.now() + '-' + file.originalname;
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  console.log(`File type: ${file.mimetype}`);
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG and PNG files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  limits: {
  fileSize: 1024 * 1024 * 10 // 10 MB
  },
  fileFilter
});

module.exports = { upload };
