import { useContext, useEffect, useState } from "react";
import { WebSocketContext } from "./WebSocketProvider";
import ChatBoxAdmin from "./ChatBoxAdmin";
import { Button, SimpleGrid } from "@mantine/core";

// work in progress
const ChatBoxWrapper = () => {
  const { messages, setMessages } = useContext(WebSocketContext);
  const [chats, setChats] = useState([]);

  // get all messages
  useEffect(() => {
    if (messages) {
      setChats(Object.entries(messages));
    }
  }, [messages]);

  const clearResolved = () => {
    setMessages(filterResolved(messages))
  }

  const filterResolved = (data) => {
    const filtered = Object.keys(data).reduce((acc, userId) => {
      const currentChat = data[userId];
      const isResolved = currentChat.some(msg => msg.resolved === true);

      if (!isResolved) {
        acc[userId] = currentChat
      }

      return acc
    }, {})

    return filtered;
  }

  // generate seperate chatbox for each unique sender id
  return (
    <>
      <h2>Admin chat</h2>
      {chats.length > 0 && <Button mb={"sm"} onClick={clearResolved}>Clear Resolved</Button>}
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
