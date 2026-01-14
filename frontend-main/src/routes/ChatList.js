import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getChatRooms } from "../api/endpoints";

const ChatList = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  getChatRooms().then((data) => {
    if (Array.isArray(data)) {
      setRooms(data);
    } else {
      setRooms([]);
    }
  });
}, []);


  return (
  <div style={{ width: "400px", margin: "auto" }}>
    <h2>Chats</h2>

    {rooms.length === 0 && (
      <p style={{ color: "gray" }}>
        No chats yet. Start a chat from a user profile 👇
      </p>
    )}

    {rooms.map((room) => (
      <div
        key={room.id}
        style={{
          padding: "12px",
          borderBottom: "1px solid #ddd",
          cursor: "pointer",
        }}
      >
        @{room.other_user}
      </div>
    ))}
  </div>
);

};

export default ChatList;
