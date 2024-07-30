import { Text, Title } from "@mantine/core";
import ChatBoxWrapper from "../../ws/ChatBoxWrapper";
import { useContext } from "react";
import { WebSocketContext } from "../../ws/WebSocketProvider";

const CustomerServicePage = () => {
  const { messages } = useContext(WebSocketContext);
  return (
    <>
      <Title order={1}>Customer service</Title>
      {
        Object.keys(messages).length > 0 ?
        <ChatBoxWrapper /> :
        <Text fs="italic">No unresolved issues...</Text>
      }
      
    </>
  );
};

export default CustomerServicePage;
