const multer = require('multer');
const path = require('path');
const fs = require('fs');
const util = require('util');

// Promisify fs.mkdir for better async handling
const mkdir = util.promisify(fs.mkdir);

// Configure Multer storage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const uploadPath = path.join(__dirname, '..', 'uploads');
      
      // Ensure the upload directory exists asynchronously
      if (!fs.existsSync(uploadPath)) {
        await mkdir(uploadPath, { recursive: true });
      }

      // Create subdirectory based on request (roomId or default)
      const subdirectory = req.body.roomId || 'default'; 
      const subdirectoryPath = path.join(uploadPath, subdirectory);

      // Ensure the subdirectory exists
      if (!fs.existsSync(subdirectoryPath)) {
        await mkdir(subdirectoryPath, { recursive: true });
      }

      cb(null, subdirectoryPath);  // Set the directory to save the file
    } catch (error) {
      cb(error);  // If there was an error creating directories, pass it to the callback
    }
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
}).single('file');  // Assuming you're uploading a single file, change as needed

module.exports = upload;
