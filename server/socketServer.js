const fs = require('fs');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const upload = require('./config/uploadConfig'); // Import the upload configuration

const basePath = path.join(__dirname, 'uploads');

module.exports = (server) => {
  const io = new Server(server, { cors: { origin: '*' } });
  const rooms = {};

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join-room', ({ roomId, username }) => {
      if (!roomId) return;

      username = username || `User-${socket.id}`;
      socket.data.username = username;

      // Create a folder for the room
      const roomPath = path.join(basePath, roomId);
      if (!fs.existsSync(roomPath)) {
        fs.mkdirSync(roomPath);
      }

      socket.join(roomId);
      if (!rooms[roomId]) rooms[roomId] = { sockets: [] };
      rooms[roomId].sockets.push(socket.id);

      io.to(roomId).emit('new-notification', {
        message: `${username} has joined the room.`,
        timestamp: new Date().toLocaleTimeString(),
      });
    });

    socket.on('upload-file', (data) => {
      const { roomId, file } = data;

      // Use multer to handle file storage
      upload.single('file')(data, (err) => {
        if (err) {
          console.error('File upload error:', err.message);
          socket.emit('file-upload-error', { message: 'File upload failed', error: err.message });
          return;
        }

        // Emit success event with the file information
        socket.to(roomId).emit('file-upload-success', {
          filename: file.filename,
          filePath: `/uploads/${roomId}/${file.filename}`
        });
      });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      for (const roomId of Object.keys(socket.rooms)) {
        if (roomId !== socket.id) {
          // Remove the socket ID from the room's list
          rooms[roomId].sockets = rooms[roomId].sockets.filter((id) => id !== socket.id);

          // Delete the room folder if no users are left in the room
          if (rooms[roomId].sockets.length === 0) {
            const roomPath = path.join(basePath, roomId);
            fs.rmdirSync(roomPath, { recursive: true });
            delete rooms[roomId];
          }

          io.to(roomId).emit('user-disconnected', socket.id);
        }
      }
    });
  });

  return io;
};
