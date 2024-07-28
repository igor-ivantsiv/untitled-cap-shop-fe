import { useContext, useState } from "react";
import { WebSocketContext } from "./WebSocketProvider";
import ChatBoxAdmin from "./ChatBoxAdmin";

const ChatBoxWrapper = () => {
  const { ws, messages } = useContext(WebSocketContext);

  return (
    <div>
      {Object.keys(messages).map((senderId) => (
          <ChatBoxAdmin
            key={senderId}
            recipientId={senderId}
            messages={messages[senderId]}
          />
        ))
      }
      
    </div>
  );
};

export default ChatBoxWrapper;
