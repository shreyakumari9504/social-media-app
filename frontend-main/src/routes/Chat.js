import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const WS_URL = "ws://127.0.0.1:8000/ws/chat/room1/";

const Chat = () => {
  const socketRef = useRef(null);
  const peerRef = useRef(null);
  const { roomId } = useParams();
  const remoteAudioRef = useRef(null);
  const [micOn, setMicOn] = useState(true);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  /* -------------------- WEBSOCKET -------------------- */

  useEffect(() => {
  if (!roomId) return;

  socketRef.current = new WebSocket(
    `ws://127.0.0.1:8000/ws/chat/${roomId}/`
  );

  socketRef.current.onmessage = async (e) => {
    const data = JSON.parse(e.data);

    if (data.type === "chat") {
      setMessages((prev) => [...prev, data]);
    }

    if (data.type === "offer") {
      await handleReceiveOffer(data.offer);
    }

    if (data.type === "answer") {
      await peerRef.current.setRemoteDescription(data.answer);
    }

    if (data.type === "ice") {
      if (peerRef.current) {
        await peerRef.current.addIceCandidate(data.candidate);
      }
    }
  };

  return () => socketRef.current.close();
}, [roomId]);


  /* -------------------- CHAT -------------------- */

  const sendMessage = () => {
  if (!text.trim()) return;

  const newMsg = {
    sender: "you",
    message: text,
  };

  
  setMessages((prev) => [...prev, newMsg]);

  
  socketRef.current.send(
    JSON.stringify({
      type: "chat",
      message: text,
    })
  );

  setText("");
};


  /* -------------------- WEBRTC -------------------- */

  const createPeerConnection = () => {
    peerRef.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.send(
          JSON.stringify({
            type: "ice",
            candidate: event.candidate,
          })
        );
      }
    };

    peerRef.current.ontrack = (event) => {
  if (event.track.kind === "video") {
    remoteVideoRef.current.srcObject = event.streams[0];
  }

  if (event.track.kind === "audio") {
    remoteAudioRef.current.srcObject = event.streams[0];
  }
};

  };

  const startCall = async (callType) => {
    createPeerConnection();

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: callType === "video",
    });

    localVideoRef.current.srcObject = stream;

    stream.getTracks().forEach((track) =>
      peerRef.current.addTrack(track, stream)
    );

    const offer = await peerRef.current.createOffer();
    await peerRef.current.setLocalDescription(offer);

    socketRef.current.send(
      JSON.stringify({
        type: "offer",
        offer: offer,
      })
    );
  };

  const handleReceiveOffer = async (offer) => {
    createPeerConnection();

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    localVideoRef.current.srcObject = stream;

    stream.getTracks().forEach((track) =>
      peerRef.current.addTrack(track, stream)
    );

    await peerRef.current.setRemoteDescription(offer);

    const answer = await peerRef.current.createAnswer();
    await peerRef.current.setLocalDescription(answer);

    socketRef.current.send(
      JSON.stringify({
        type: "answer",
        answer: answer,
      })
    );
  };
  const endCall = () => {
  // stop local video/audio
  if (localVideoRef.current?.srcObject) {
    localVideoRef.current.srcObject
      .getTracks()
      .forEach((track) => track.stop());
    localVideoRef.current.srcObject = null;
  }

  // stop remote video
  if (remoteVideoRef.current?.srcObject) {
    remoteVideoRef.current.srcObject = null;
  }

  // close peer connection
  if (peerRef.current) {
    peerRef.current.close();
    peerRef.current = null;
  }
};
const toggleMic = () => {
  const stream = localVideoRef.current?.srcObject;
  if (!stream) return;

  stream.getAudioTracks().forEach((track) => {
    track.enabled = !track.enabled;
    setMicOn(track.enabled);
  });
  
};




  /* -------------------- UI -------------------- */

return (
  <div style={{
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#e5ddd5",
    fontFamily: "Segoe UI, Helvetica, Arial",
  }}>

    {/* HEADER */}
    <div style={{
      height: "56px",
      background: "#075e54",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 15px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: "35px",
          height: "35px",
          borderRadius: "50%",
          background: "#ca25d3",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold"
        }}>
          U
        </div>
        <span>User</span>
      </div>

      <div style={{ display: "flex", gap: "15px" }}>
        <span style={{ cursor: "pointer" }} onClick={() => startCall("audio")}>📞</span>
        <span style={{ cursor: "pointer" }} onClick={() => startCall("video")}>🎥</span>
      </div>
    </div>

    {/* CHAT BODY */}
    <div style={{
      flex: 1,
      padding: "15px",
      overflowY: "auto",
      backgroundImage:
        "linear-gradient(#e5ddd5 0%, #e5ddd5 100%)",
    }}>
      {messages.map((msg, i) => {
        const isMe = msg.sender === "you";
        return (
          <div key={i} style={{
            display: "flex",
            justifyContent: isMe ? "flex-end" : "flex-start",
            marginBottom: "8px",
          }}>
            <div style={{
              background: isMe ? "#dcf8c6" : "#fff",
              padding: "8px 12px",
              borderRadius: "8px",
              maxWidth: "65%",
              fontSize: "14px",
              boxShadow: "0 1px 1px rgba(0,0,0,0.15)",
            }}>
              {msg.message}
            </div>
          </div>
        );
      })}
    </div>

    {/* INPUT BAR */}
    <div style={{
      height: "60px",
      background: "#f0f0f0",
      display: "flex",
      alignItems: "center",
      padding: "0 10px",
      gap: "10px",
    }}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message"
        style={{
          flex: 1,
          padding: "10px 15px",
          borderRadius: "20px",
          border: "none",
          outline: "none",
          fontSize: "14px",
        }}
      />
      <button
        onClick={sendMessage}
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "none",
          background: "#7f25d3",
          color: "white",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        ➤
      </button>
    </div>

    {/* CALL AREA */}
    <div style={{ display: "flex", background: "#000" }}>
      <video ref={localVideoRef} autoPlay muted width="50%" />
      <video ref={remoteVideoRef} autoPlay width="50%" />
    </div>

    <audio ref={remoteAudioRef} autoPlay />
  </div>
);

};

export default Chat;
