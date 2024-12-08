const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const roomId = req.body.roomId; // Room ID passed with the request
    const roomPath = path.join(__dirname, 'uploads', roomId);

    // Ensure the directory exists
    if (!fs.existsSync(roomPath)) {
      fs.mkdirSync(roomPath, { recursive: true });
    }

    cb(null, roomPath);
  },
  filename: (req, file, cb) => {
    // Use the original filename and a timestamp to avoid name collisions
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage, 
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only JPEG, PNG, and PDF are allowed.'));
    }
    cb(null, true);
  }
});

module.exports = upload;
