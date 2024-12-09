const express = require('express');
const authController = require('../controllers/authController');
const jwtMiddleware = require('../middleware/jwtMiddleware');
const upload = require('../middleware/multerMiddleware');
const { check, validationResult } = require('express-validator');

const router = express.Router();

// Utility to handle async errors
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Routes
router.post(
  '/api/register',
  [
    check('email', 'Invalid email').isEmail(),
    check('password', 'Password must be 6+ chars').isLength({ min: 6 }),
  ],
  asyncHandler(authController.register)
);

router.post('/api/login', asyncHandler(authController.login));

// Single file upload
router.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    res.json({
      message: 'File uploaded successfully!',
      fileUrl: `/uploads/${req.file.filename}`,
    });
  } catch (error) {
    res.status(500).json({ message: 'File upload failed', error: error.message });
  }
});

// Multiple files upload
router.post('/api/upload-multiple', upload.array('files', 5), (req, res) => {
  try {
    const fileUrls = req.files.map(file => `/uploads/${file.filename}`);
    res.status(200).json({ message: 'Files uploaded successfully', fileUrls });
  } catch (error) {
    res.status(500).json({ message: 'File upload failed', error: error.message });
  }
});

// Test Route
router.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'API is working!' });
});

// Protected Profile Update
router.post('/api/update-profile', jwtMiddleware, (req, res) => {
  const { username, email } = req.body;
  if (!username || !email) {
    return res.status(400).json({ message: 'Bad Request: Missing data' });
  }
  res.status(200).json({ message: 'Profile updated successfully' });
});

module.exports = router;
