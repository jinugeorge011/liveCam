const fs = require('fs');
const path = require('path');
const { Server } = require('socket.io');
const multer = require('multer'); // Import multer directly for simplicity

const basePath = path.join(__dirname, 'uploads');

// Multer configuration
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const roomPath = path.join(basePath, req.body.roomId || 'default');
      if (!fs.existsSync(roomPath)) {
        fs.mkdirSync(roomPath, { recursive: true });
      }
      cb(null, roomPath);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

module.exports = (server) => {
  const io = new Server(server, { cors: { origin: '*' } });
  const rooms = {};

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join Room
    socket.on('join-room', ({ roomId, username }) => {
      if (!roomId) return;

      username = username || `User-${socket.id}`;
      socket.data.username = username;

      socket.join(roomId);
      if (!rooms[roomId]) rooms[roomId] = { sockets: [] };
      rooms[roomId].sockets.push(socket.id);

      io.to(roomId).emit('new-notification', {
        message: `${username} has joined the room.`,
        timestamp: new Date().toLocaleTimeString(),
      });
    });

    // File Upload
    socket.on('upload-file', (data) => {
      const { roomId, file } = data;
      const roomPath = path.join(basePath, roomId);

      if (!fs.existsSync(roomPath)) {
        fs.mkdirSync(roomPath, { recursive: true });
      }

      const filename = `${Date.now()}-${file.originalname}`;
      const filePath = path.join(roomPath, filename);

      // Simulate file saving
      fs.writeFileSync(filePath, file.buffer, (err) => {
        if (err) {
          console.error('File upload error:', err.message);
          socket.emit('file-upload-error', { message: 'File upload failed', error: err.message });
          return;
        }
        console.log('File saved:', filename);

        socket.to(roomId).emit('file-upload-success', {
          filename,
          filePath: `/uploads/${roomId}/${filename}`,
        });
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      for (const roomId of Object.keys(socket.rooms)) {
        if (roomId !== socket.id) {
          rooms[roomId].sockets = rooms[roomId].sockets.filter((id) => id !== socket.id);

          if (rooms[roomId].sockets.length === 0) {
            const roomPath = path.join(basePath, roomId);
            fs.rmSync(roomPath, { recursive: true, force: true });
            delete rooms[roomId];
          }

          io.to(roomId).emit('user-disconnected', socket.id);
        }
      }
    });
  });

  return io;
};
