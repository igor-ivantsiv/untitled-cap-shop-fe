import { useContext, useEffect, useState } from "react";
import { WebSocketContext } from "./WebSocketProvider";
import ChatBoxAdmin from "./ChatBoxAdmin";
import { SimpleGrid } from "@mantine/core";

// work in progress
const ChatBoxWrapper = () => {
  const { ws, messages } = useContext(WebSocketContext);
  const [chats, setChats] = useState([]);

  // get all messages
  useEffect(() => {
    if (messages) {
      setChats(Object.entries(messages));
    }
  }, [messages]);

  // generate seperate chatbox for each unique sender id
  return (
    <>
      <h2>Admin chat</h2>
      <SimpleGrid cols={{ base: 1, md: 3, lg: 4 }}>
        {chats.map((sender) => (
          <ChatBoxAdmin
            key={sender[0]}
            recipientId={sender[0]}
            messagesReceived={sender[1]}
          />
        ))}
      </SimpleGrid>
    </>
  );
};

export default ChatBoxWrapper;
