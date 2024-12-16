import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const ChatAndVideoSection = () => {
  // State Management
  const [roomId, setRoomId] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [fileToSend, setFileToSend] = useState(null);
  const [videoFilter, setVideoFilter] = useState(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  // Refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStream = useRef(null);
  const remoteStream = useRef(new MediaStream());
  const peerConnection = useRef(null);
  const socket = useRef(null);

  // ICE Servers Configuration
  const iceServers = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

  // Socket Initialization
  useEffect(() => {
    socket.current = io('http://localhost:3000');

    socket.current.on('offer', handleOffer);
    socket.current.on('answer', handleAnswer);
    socket.current.on('ice-candidate', handleNewICECandidate);
    socket.current.on('file-received', handleFileReceived);

    return () => socket.current.disconnect();
  }, []);

  // Video and Audio Stream Setup
  const startVideoStream = async () => {
    try {
      localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideoRef.current) localVideoRef.current.srcObject = localStream.current;
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const toggleVideo = () => {
    const videoTracks = localStream.current?.getVideoTracks();
    if (videoTracks?.length) {
      videoTracks[0].enabled = !isVideoEnabled;
      setIsVideoEnabled((prev) => !prev);
    }
  };

  const toggleAudio = () => {
    const audioTracks = localStream.current?.getAudioTracks();
    if (audioTracks?.length) {
      audioTracks[0].enabled = !isAudioEnabled;
      setIsAudioEnabled((prev) => !prev);
    }
  };

  // Room Handling
  const joinRoom = () => {
    if (roomId.trim()) {
      socket.current.emit('join-room', roomId);
      setIsJoined(true);
      startVideoStream();
    }
  };

  // WebRTC Signaling Handlers
  const handleOffer = async (offer) => {
    if (!peerConnection.current) initializePeerConnection();
    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);
    socket.current.emit('answer', { answer, roomId });
  };

  const handleAnswer = async (answer) => {
    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
  };

  const handleNewICECandidate = (candidate) => {
    if (peerConnection.current) {
      peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const initializePeerConnection = () => {
    peerConnection.current = new RTCPeerConnection(iceServers);

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current.emit('ice-candidate', { candidate: event.candidate, roomId });
      }
    };

    peerConnection.current.ontrack = (event) => {
      event.streams[0]?.getTracks().forEach((track) => remoteStream.current.addTrack(track));
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream.current;
    };

    localStream.current?.getTracks().forEach((track) =>
      peerConnection.current.addTrack(track, localStream.current)
    );
  };

  // Messaging Handlers
  const sendMessage = () => {
    if (currentMessage.trim()) {
      socket.current.emit('message', { roomId, message: currentMessage });
      setMessages((prev) => [...prev, { sender: 'You', text: currentMessage }]);
      setCurrentMessage('');
    }
  };

  const handleMessageReceived = (message) => {
    setMessages((prev) => [...prev, { sender: 'Other', text: message }]);
  };

  // File Sharing Handlers
  const handleFileChange = (event) => {
    setFileToSend(event.target.files[0]);
  };

  const sendFile = () => {
    if (fileToSend) {
      const reader = new FileReader();
      reader.onload = () => {
        socket.current.emit('send-file', { roomId, file: reader.result, fileName: fileToSend.name });
        setFileToSend(null);
      };
      reader.readAsArrayBuffer(fileToSend);
    }
  };

  const handleFileReceived = ({ file, fileName }) => {
    const blob = new Blob([new Uint8Array(file)]);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-screen">
      {/* Video Section */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 text-white">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-1/2 ${videoFilter}`}
        ></video>
        <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-1/2"></video>
        <div className="mt-4">
          <button className="btn" onClick={toggleVideo}>
            {isVideoEnabled ? 'Disable' : 'Enable'} Video
          </button>
          <button className="btn ml-2" onClick={toggleAudio}>
            {isAudioEnabled ? 'Disable' : 'Enable'} Audio
          </button>
          <select
            className="btn ml-2"
            value={videoFilter || ''}
            onChange={(e) => setVideoFilter(e.target.value)}
          >
            <option value="">No Filter</option>
            <option value="grayscale">Grayscale</option>
            <option value="sepia">Sepia</option>
          </select>
        </div>
      </div>

      {/* Chat Section */}
      <div className="w-full md:w-1/3 bg-gray-800 text-white p-4 flex flex-col">
        <div className="flex items-center mb-4">
          <input
            className="flex-grow p-2 rounded bg-gray-700"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button className="btn ml-2" onClick={joinRoom}>Join</button>
        </div>
        <div className="flex-grow overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className="my-2">
              <strong>{msg.sender}: </strong>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="flex items-center mt-4">
          <input
            className="flex-grow p-2 rounded bg-gray-700"
            placeholder="Type a message"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
          />
          <button className="btn ml-2" onClick={sendMessage}>Send</button>
        </div>
        <div className="mt-4">
          <input type="file" onChange={handleFileChange} />
          <button className="btn ml-2" onClick={sendFile}>Send File</button>
        </div>
      </div>
    </div>
  );
};

export default ChatAndVideoSection;
