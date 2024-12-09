// frontend/src/components/VideoChat.jsx
import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io.connect('https://livecam-7fzf.onrender.com');

const VideoChat = () => {
  const [roomId, setRoomId] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [otherUserId, setOtherUserId] = useState('');
  const myVideo = useRef();
  const otherVideo = useRef();
  const peerConnection = useRef(new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  }));

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
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
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

      socket.on('user-disconnected', () => {
        if (otherVideo.current.srcObject) {
          otherVideo.current.srcObject.getTracks().forEach(track => track.stop());
          otherVideo.current.srcObject = null;
        }
        setOtherUserId('');
      });
    } catch (error) {
      console.error('Error accessing media devices.', error);
    }
  };

  const callUser = async (userId) => {
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socket.emit('offer', { offer, to: userId });
  };

  return (
    <div>
      <input
      className='dark:text-slate-800 rounded-md'
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        disabled={isJoined}
      />
      <button onClick={joinRoom} disabled={isJoined}>Join Room</button>
      
      <div className="video-container">
        <div>
          <h3>Your Video</h3>
          <video ref={myVideo} autoPlay />
        </div>
        <div>
          <h3>Other User's Video</h3>
          <video ref={otherVideo} autoPlay />
        </div>
      </div>
    </div>
  );
};

export default VideoChat;
