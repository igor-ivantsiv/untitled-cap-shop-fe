import { useContext, useEffect, useState } from "react";
import { WebSocketContext } from "./WebSocketProvider";
import ChatBoxAdmin from "./ChatBoxAdmin";

// work in progress
const ChatBoxWrapper = () => {
  const { ws, messages } = useContext(WebSocketContext);
  const [chats, setChats] = useState([])

  useEffect(() => {
    if (messages) {
      setChats(Object.entries(messages))
    }
  }, [messages])

  return (
    <div>
      <h2>Admin chat</h2>
      {chats.map((sender) => (
          <ChatBoxAdmin
            key={sender[0]}
            recipientId={sender[0]}
            messagesReceived={sender[1]}
          />
        ))
      }
      
    </div>
  );
};

export default ChatBoxWrapper;
