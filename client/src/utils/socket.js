// src/utils/socket.js
import { io } from 'socket.io-client';

// Assuming your backend server is running on http://localhost:5000
const socket = io('https://livecam-7fzf.onrender.com');

export default socket;
