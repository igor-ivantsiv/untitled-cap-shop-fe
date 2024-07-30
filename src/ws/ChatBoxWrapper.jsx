import { useContext, useEffect, useState } from "react";
import { WebSocketContext } from "./WebSocketProvider";
import ChatBoxAdmin from "./ChatBoxAdmin";
import { Button, SimpleGrid } from "@mantine/core";

const ChatBoxWrapper = () => {
  const { messages, setMessages } = useContext(WebSocketContext);
  const [chats, setChats] = useState([]);

  // get all messages
  useEffect(() => {
    if (messages) {
      // get an array for each unique sender id
      setChats(Object.entries(messages));
    }
  }, [messages]);

  // clear all conversations with 'resolved: true'
  const clearResolved = () => {
    setMessages(filterResolved(messages));
  };

  const filterResolved = (data) => {
    // get array of all keys (ids) in object, reduce into new object
    const filtered = Object.keys(data).reduce((acc, userId) => {
      // get all messages with current userId
      const currentChat = data[userId];

      // check if any object in array of msgs contains 'resolved: true' prop
      const isResolved = currentChat.some((msg) => msg.resolved === true);

      // if no resolved prop found, add to accumulator
      if (!isResolved) {
        acc[userId] = currentChat;
      }

      return acc;
    }, {});

    // return filtered object
    return filtered;
  };

  // generate seperate chatbox for each unique sender id
  return (
    <>
      <h2>Admin chat</h2>
      {chats.length > 0 && (
        <Button mb={"sm"} onClick={clearResolved}>
          Clear Resolved
        </Button>
      )}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
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
