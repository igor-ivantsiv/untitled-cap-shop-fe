import { Text } from "@mantine/core";
import ChatBoxWrapper from "../../ws/ChatBoxWrapper";
import { useContext } from "react";
import { WebSocketContext } from "../../ws/WebSocketProvider";
import classes from "../../styles/Headers.module.css";

const CustomerServicePage = () => {
  const { messages } = useContext(WebSocketContext);
  return (
    <>
      <h1 className={classes.header1}>Customer Service</h1>
      {Object.keys(messages).length > 0 ? (
        <ChatBoxWrapper />
      ) : (
        <Text fs="italic">No unresolved issues...</Text>
      )}
    </>
  );
};

export default CustomerServicePage;
