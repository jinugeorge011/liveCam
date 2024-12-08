const express = require('express');
const authController =require('../controllers/authController')
const jwtMiddleware = require('../middleware/jwtMiddleware');
const upload = require('../middleware/multerMiddleware');

const router = express.Router();

// Routes
router.post('/api/register', authController.register);
router.post('/api/login', authController.login);

// Single file upload
router.post('/upload', upload.single('file'), (req, res) => {
    try {
      const fileUrl = `/uploads/${req.file.filename}`;
      res.status(200).json({ message: 'File uploaded successfully', fileUrl });
    } catch (error) {
      res.status(500).json({ message: 'File upload failed', error: error.message });
    }
  });
  
  // Multiple files upload
  router.post('/upload-multiple', upload.array('files', 5), (req, res) => {
    try {
      const fileUrls = req.files.map(file => `/uploads/${file.filename}`);
      res.status(200).json({ message: 'Files uploaded successfully', fileUrls });
    } catch (error) {
      res.status(500).json({ message: 'File upload failed', error: error.message });
    }
  });


module.exports = router;
