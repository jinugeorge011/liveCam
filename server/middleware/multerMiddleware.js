const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'uploads');
    
    // Ensure the upload directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Optionally, create a dynamic subdirectory based on request (e.g., user ID or room)
    const subdirectory = req.body.roomId || 'default';  // Example: using roomId or fallback to 'default'
    const subdirectoryPath = path.join(uploadPath, subdirectory);

    // Ensure the subdirectory exists
    if (!fs.existsSync(subdirectoryPath)) {
      fs.mkdirSync(subdirectoryPath, { recursive: true });
    }

    cb(null, subdirectoryPath);  // Set the directory to save the file
  },
  filename: (req, file, cb) => {
    // Use timestamp and original filename for unique naming
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Multer instance with validation
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only JPEG, PNG, and PDF are allowed.'));
    }
    cb(null, true);
  },
});

// Error handling middleware
upload.array('files')  // Assuming multiple files in the form
  .use((err, req, res, next) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });

module.exports = upload;
