require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/db');
const router = require('./routes/router');
const applicationMiddleware = require('./middleware/applicationMiddleware');
const { Server } = require('socket.io');
const upload = require('./config/uploadConfig');
const socketServer = require('./socketServer');
const path = require('path');

const allowedOrigins = ["https://chatwave8787.netlify.app"];

const app = express();

// ** CORS configuration for Express and Socket.IO **
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

// Apply CORS middleware to Express routes
app.use(cors(corsOptions));

// Middleware
app.use(express.json());  // Enable JSON parsing for API requests
app.use(applicationMiddleware);  // Apply any custom middleware
app.use(router);  // Use your defined routes

// app.use('/api/user', router);

// MongoDB Connection
connectDB();

// Serve uploaded files (static file serving)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({
    message: 'File uploaded successfully!',
    fileUrl: `/uploads/${req.file.filename}`,
  });
});

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: corsOptions,  // Reuse the same CORS options for Socket.IO
});

// Setup Socket.IO event handling
socketServer(io);

// Error handling middleware (for unhandled errors)
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: err.message });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
