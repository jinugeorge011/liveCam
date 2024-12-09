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
const allowedOrigins = ["https://chatwave8787.netlify.app"];


// const multer = require('multer');
// const path = require('./uploads');


const app = express();
app.use(cors());
app.use(express.json()); // Enable JSON parsing for API requests
app.use(applicationMiddleware);
app.use(router);

app.get('/api/user', (req, res) => { res.send('User endpoint'); });

// // Configuring Multer storage
// const storage = multer.diskStorage({
//   destination: './uploads/', // Specify the directory where files should be stored
//   filename: (req, file, cb) => {
//     // Use a timestamp and original filename to avoid name collisions
//     cb(null, ${Date.now()}-${file.originalname});
//   },
// });

// // Create a Multer instance with the storage configuration
// const upload = multer({ storage });

// // Define an endpoint to handle file uploads
// app.post('/upload', upload.single('file'), (req, res) => {
//   // Check if a file was uploaded
//   if (!req.file) {
//     return res.status(400).send('No file uploaded.');
//   }

//   // Respond with the file URL (path to the uploaded file)
//   res.json({
//     message: 'File uploaded successfully!',
//     fileUrl: /uploads/${req.file.filename},
//   });
// });

// // Serve the uploaded files through a static route
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// MongoDB Connection
connectDB();

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

// Handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  // File is already uploaded via multer middleware
  res.json({
    message: 'File uploaded successfully!',
    fileUrl: `/uploads/${req.file.filename}`
  });
});


server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
