import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import EmojiPicker from 'emoji-picker-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './chat.css';

const socket = io.connect('http://localhost:5000');

const ChatAndVideoSection = ({ user }) => {
  const [roomId, setRoomId] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [otherUserId, setOtherUserId] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoFilter, setVideoFilter] = useState(null);


  const myVideo = useRef();
  const isLoggedIn = !!sessionStorage.getItem('token');
  const otherVideo = useRef();
  const chatEndRef = useRef(null);
  const peerConnection = useRef(new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  }));

  const handleEmojiClick = (emojiObject) => {
    setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  useEffect(() => {
    socket.on('connect', () => console.log(`Connected with ID: ${socket.id}`));

    socket.on('offer', async (data) => {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.emit('answer', { answer, to: data.from });
    });

    socket.on('answer', async (data) => {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
    });

    socket.on('ice-candidate', (data) => {
      peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
    });

    socket.on('chat-message', (messageData) => {
      setMessages((prevMessages) => [...prevMessages, messageData]);
    });

    socket.on('file-message', (fileMessage) => {
      setMessages((prevMessages) => [...prevMessages, fileMessage]);
    });

    return () => socket.disconnect();
  }, []);

  const joinRoom = async () => {
    if (roomId.trim()) {
      setIsJoined(true);
      socket.emit('join-room', roomId);
      await startVideoStream();
    }
  };

  const startVideoStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: isVideoEnabled, 
        audio: isAudioEnabled 
      });

      myVideo.current.srcObject = stream;

      stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));

      peerConnection.current.ontrack = ({ streams: [remoteStream] }) => {
        otherVideo.current.srcObject = remoteStream;
      };

      peerConnection.current.onicecandidate = ({ candidate }) => {
        if (candidate) {
          socket.emit('ice-candidate', { candidate, to: otherUserId });
        }
      };

      socket.on('user-joined', (userId) => {
        setOtherUserId(userId);
        callUser(userId);
      });

      socket.on('user-disconnected', endChat);
    } catch (error) {
      console.error('Error accessing media devices.', error);
    }
  };

  const callUser = async (userId) => {
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socket.emit('offer', { offer, to: userId });
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      const messageData = {
        id: Date.now(),
        sender: user ? user.name : 'Guest',
        content: '',
        file: { name: selectedFile.name, url: data.fileUrl },
      };

      setMessages((prevMessages) => [...prevMessages, messageData]);
      socket.emit('chat-message', messageData);
      setSelectedFile(null);
    } catch (error) {
      console.error('File upload failed:', error);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const messageData = {
        id: Date.now(),
        sender: user ? user.name : 'Guest',
        content: newMessage,
      };
      socket.emit('chat-message', messageData);
      setMessages([...messages, messageData]);
      setNewMessage('');
    }
  };

  const endChat = () => {
    setIsJoined(false);
    setRoomId('');
    setOtherUserId('');
    setMessages([]);
    setNewMessage('');

    if (myVideo.current.srcObject) {
      myVideo.current.srcObject.getTracks().forEach(track => track.stop());
      myVideo.current.srcObject = null;
    }

    if (otherVideo.current.srcObject) {
      otherVideo.current.srcObject.getTracks().forEach(track => track.stop());
      otherVideo.current.srcObject = null;
    }

    peerConnection.current.close();
    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    socket.emit('leave-room', roomId);
  };

  const toggleVideo = () => {
    const stream = myVideo.current.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => {
        if (track.kind === 'video') {
          track.enabled = !track.enabled;
          setIsVideoEnabled(track.enabled);
        }
      });
    }
  };

  const toggleAudio = () => {
    const stream = myVideo.current.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => {
        if (track.kind === 'audio') {
          track.enabled = !track.enabled;
          setIsAudioEnabled(track.enabled);
        }
      });
    }
  };

  const toggleFilter = (filter) => {
    if (myVideo.current) {
      myVideo.current.style.filter = filter;
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  return (
    <>
      <Header users={isLoggedIn ? true : false} />
      <div className="flex flex-col h-screen bg-gray-200 text-black dark:bg-purple-900 dark:text-white md:flex-row">
        {/* Video Section */}
        <div className="flex-1 bg-white text-black dark:bg-purple-900 dark:text-white flex flex-col h-[650px] justify-center items-center p-4">
          <div className="w-full text-center mb-4">
            <input
              className="bg-white ml-2 mr-2 text-blue-800 border border-blue-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group p-2 mb-2"
              type="text"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              disabled={isJoined}
            />
            <button
            onClick={joinRoom}
            disabled={isJoined}
             className="bg-blue-950 ml-2 mr-2 text-blue-400 border border-blue-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
      <span className="bg-blue-400 shadow-blue-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
      Join Room
    </button>
            <button
              onClick={endChat}
              disabled={!isJoined}
              className="bg-red-700 ml-2 mr-2 text-white border border-blue-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
      <span className="bg-blue-400 shadow-blue-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
              End Chat
            </button>
          </div>
          <div className="video-container grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-center mb-2">Your Video</h3>
              <video ref={myVideo} autoPlay muted className="w-full rounded-md transform scale-x-[-1]" 
              style={{ filter: videoFilter }} />
            </div>
            <div>
              <h3 className="text-center mb-2">Other User's Video</h3>
              <video ref={otherVideo} autoPlay className="w-full rounded-md transform scale-x-[-1]" />
            </div>
          </div>

{/* Filter Dropdown */}
<div className="mt-4">
  <label htmlFor="videoFilter" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Choose Video Effect</label>
  <select
    id="videoFilter"
    onChange={(e) => toggleFilter(e.target.value)}
    className="bg-blue-950 ml-2 mr-2 text-blue-400 border border-blue-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
      <span className="bg-blue-400 shadow-blue-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
  
    <option value="none">Reset Effect</option>
    <option value="grayscale(100%)">Grayscale</option>
    <option value="sepia(100%)">Sepia</option>
    <option value="blur(5px)">Blur</option>
    <option value="invert(100%)">Invert Colors</option>
    <option value="brightness(150%)">Brightness</option>
    <option value="contrast(150%)">Contrast</option>
    <option value="hue-rotate(90deg)">Hue Rotate</option>
    <option value="hue-rotate(360deg) animation rainbowFlow 5s infinite">Rainbow Flow</option>
    <option value="contrast(150%) hue-rotate(120deg) brightness(80%)">Matrix Style</option>
    <option value="blur(10px) contrast(120%)">Underwater Blur</option>
    <option value="contrast(200%) saturate(0.8)">Cartoon Effect</option>
    <option value="kaleidoscope">Kaleidoscope</option>
    <option value="animation disco 1s infinite">Disco Party</option>
    <option value="animation ghostEffect 2s infinite">Ghost Effect</option>
    <option value="animation glitch 0.5s infinite">Glitch Effect</option>
  </select>
</div>



          {/* Toggle Buttons */}
          <div className="flex space-x-4 mt-4">
            <button
              onClick={toggleVideo}
              // className={`px-4 py-2 ${isVideoEnabled ? 'bg-teal-500' : 'bg-gray-500'} text-white rounded-md`}
              className="bg-blue-950 ml-2 mr-2 text-blue-400 border border-blue-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
      <span className="bg-blue-400 shadow-blue-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
              {isVideoEnabled ? 'Turn Off Video' : 'Turn On Video'}
            </button>
            <button
              onClick={toggleAudio}
              // className={`px-4 py-2 ${isAudioEnabled ? 'bg-teal-500' : 'bg-gray-500'} text-white rounded-md`}
              className="bg-blue-950 ml-2 mr-2 text-blue-400 border border-blue-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
      <span className="bg-blue-400 shadow-blue-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
              {isAudioEnabled ? 'Mute Mic' : 'Unmute Mic'}
            </button>
          </div>
        </div>

        {/* Chat Section */}
        <div className="flex flex-col h-[650px] md:w-1/3 m-3 bg-gray-100 dark:bg-blue-900 border-2 border-dashed border-black dark:border-white p-4 rounded-lg shadow-lg">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-2 mb-4 p-3 flex flex-col-reverse bg-gray-200 dark:bg-purple-950 rounded-lg shadow-inner">
          {messages.slice().reverse().map((message) => (
  <div key={message.id} className="flex items-start mb-2">
    <p className="font-semibold dark:text-gray-300 text-teal-800 mr-2">{message.sender}:</p>
    {message.content ? (
      <p className="text-gray-700 dark:text-gray-400">{message.content}</p>
    ) : message.file ? (
      <a
        href={message.file.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline"
      >
        {message.file.name}
      </a>
    ) : null}
  </div>
))}

            <div ref={chatEndRef} />
          </div>

{/* Message Input Section */}
<div className="mt-4 flex items-center relative">
  {/* Emoji Picker Button */}
  <div
    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
    className="cursor-pointer text-2xl text-black dark:text-white pr-3 rounded-lg"
  >
    😊
  </div>

  {/* Message Input */}
  <form onSubmit={sendMessage} className="flex items-center w-full">
    <input
      type="text"
      className="flex-1 bg-white ml-2 mr-2 text-blue-800 border border-blue-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
      placeholder="Type a message..."
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
    />

    {/* Send Button */}
    <button
      type="submit"
      className="bg-blue-950 ml-2 mr-2 text-blue-400 border border-blue-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
      <span className="bg-blue-400 shadow-blue-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
    
      Send
    </button>
  </form>

  {/* Emoji Picker Display */}
  {showEmojiPicker && (
    <div className="absolute bottom-full left-0 mb-2 w-full">
      <EmojiPicker onEmojiClick={handleEmojiClick} />
    </div>
  )}
</div>

{/* File Upload Section */}
<div className="flex items-center mt-2">
  {/* File Input */}
  <input
  
    type="file"
    id="fileInput"
    style={{ display: 'none' }}
    onChange={handleFileChange}
    className="bg-blue-950 ml-2 mr-2 text-blue-400 border border-blue-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
  />
  <label
    htmlFor="fileInput"
    className="bg-blue-950 ml-2 mr-2 text-blue-400 border border-blue-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
      <span className="bg-blue-400 shadow-blue-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
    📎 Choose File
  </label>

  {/* File Name Display */}
  {selectedFile && (
    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
      {selectedFile.name}
    </span>
  )}

  {/* Upload and Cancel Buttons */}
  {selectedFile && (
    <div className="ml-3 flex space-x-2">
      {/* Upload Button */}
      <button
        onClick={uploadFile}
        type="button"
        className="bg-blue-950 ml-2 mr-2 text-blue-400 border border-blue-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
      <span className="bg-blue-400 shadow-blue-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
      
        Upload
      </button>

      {/* Cancel Button */}
      <button
        onClick={() => setSelectedFile(null)} // Clears the selected file
        type="button"
        className="bg-red-700 ml-2 mr-2 text-white border border-blue-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
      <span className="bg-blue-400 shadow-blue-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
        Cancel
      </button>
    </div>
  )}
</div>


        </div>
      </div>
      <Footer />
    </>
  );
};

export default ChatAndVideoSection;
