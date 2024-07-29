import { useContext, useEffect, useState } from "react";
import { WebSocketContext } from "./WebSocketProvider";
import {
  Button,
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
const ChatBoxAdmin = ({ recipientId, messagesReceived, clearResolved }) => {
  const { ws, sendMessage } = useContext(WebSocketContext);
  const [buttonLoading, setButtonLoading] = useState(false);

  const [checked, setChecked] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      adminMessage: "",
    },

    validate: {
      adminMessage: isNotEmpty("Please include a message"),
    },
  });

  // send message to specific userId
  const handleSendMessage = (values) => {
    setButtonLoading(true);
    const { adminMessage } = values;
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

  useEffect(() => {
    console.log("MESSAGES: ", messagesReceived);
  }, [messagesReceived]);

  return (
    <>
      <Paper withBorder p={"md"}>
        <Group>
          <Title order={4}>Support</Title>
          <Chip checked={checked} onChange={() => setChecked((v) => !v)}>
            {checked ?
            <Text span>Resolved</Text> :
            <Text span>Resolve</Text>
            }
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
          <Button
            type="submit"
            loading={buttonLoading}
            loaderProps={{ type: "dots" }}
          >
            Send
          </Button>
        </form>
      </Paper>
    </>
  );
};

export default ChatBoxAdmin;
