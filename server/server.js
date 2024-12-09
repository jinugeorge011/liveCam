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

// Configure CORS for both Express and Socket.IO
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST"],
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(applicationMiddleware);
app.use(router);

// MongoDB Connection
connectDB();

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({
    message: 'File uploaded successfully!',
    fileUrl: `/uploads/${req.file.filename}`
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Setup Socket.IO
socketServer(io);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: err.message });
});

// Start the server
server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
