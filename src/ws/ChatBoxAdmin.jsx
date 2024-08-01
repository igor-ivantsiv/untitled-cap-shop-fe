import { useContext, useEffect, useState } from "react";
import { WebSocketContext } from "./WebSocketProvider";
import {
  Button,
  Center,
  Chip,
  Divider,
  Group,
  Paper,
  ScrollArea,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";

// work in progress
const ChatBoxAdmin = ({ recipientId, messagesReceived }) => {
  const { sendMessage, resolveMessage } = useContext(WebSocketContext);
  const [buttonLoading, setButtonLoading] = useState(false);

  const [isResolved, setIsResolved] = useState(() => {
    // use function to find if conversation has resolved prop, and what its value is
    const resolvedMessage = messagesReceived.find((obj) => "resolved" in obj);
    return resolvedMessage ? resolvedMessage.resolved : false;
  });

  // update state whenever 'messages' state changes
  useEffect(() => {
    const resolvedMessage = messagesReceived.find((obj) => "resolved" in obj);

    // if 'resolved' object is found -> set state to its value, else set to false
    setIsResolved(resolvedMessage ? resolvedMessage.resolved : false);
  }, [messagesReceived]);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      adminMessage: "",
    },

    validate: {
      adminMessage: isNotEmpty("Please include a message"),
    },
  });

  // add 'resolved' prop to chat, use function from wsContext
  const handleResolve = (value) => {
    resolveMessage(recipientId, value);
  };

  // send message to specific userId
  const handleSendMessage = (values) => {
    setButtonLoading(true);
    const { adminMessage } = values;

    // send message through websocket, verify if msg was sent
    const sent = sendMessage(recipientId, adminMessage);
    sent
      ? form.reset()
      : form.setErrors({
          adminMessage: "Couldn't send message, please try again later",
        });

    setTimeout(() => {
      setButtonLoading(false);
    }, 500);
  };

  return (
    <>
      <Paper withBorder p={"md"}>
        <Group>
          <Title order={4}>Support</Title>
          <Chip checked={isResolved} onChange={handleResolve}>
            {isResolved ? (
              <Text span>Resolved</Text>
            ) : (
              <Text span>Resolve</Text>
            )}
          </Chip>
        </Group>

        <Divider m={"sm"} />
        <ScrollArea h={200}>
          {messagesReceived.map((msg, index) => (
            <div key={index}>
              <Text fw={700} span>
                {msg.username}
              </Text>
              <Text>{msg.content}</Text>
            </div>
          ))}
        </ScrollArea>
        <form autoComplete="off" onSubmit={form.onSubmit(handleSendMessage)}>
          <TextInput
            {...form.getInputProps("adminMessage")}
            key={form.key("adminMessage")}
            aria-label="Send message"
            mb={"sm"}
          />
          <Center>
          <Button
            type="submit"
            loading={buttonLoading}
            loaderProps={{ type: "dots" }}
          >
            Send
          </Button>
          </Center>
        </form>
      </Paper>
    </>
  );
};

export default ChatBoxAdmin;
