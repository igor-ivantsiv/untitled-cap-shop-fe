import { useContext, useEffect, useRef, useState } from "react";
import { WebSocketContext } from "./WebSocketProvider";
import { isNotEmpty, useForm } from "@mantine/form";
import {
  Button,
  Dialog,
  HoverCard,
  ScrollArea,
  Text,
  TextInput,
} from "@mantine/core";
import { SessionContext } from "../contexts/SessionContext";

const ChatBox = ({openedChat, toggleChat, closeChat}) => {
  const { messages, sendMessage } = useContext(WebSocketContext);
  const { currentUser } = useContext(SessionContext);
  const recipientId = useRef("");
  const [receivedMessages, setReceivedMessages] = useState([]);

  const [buttonLoading, setButtonLoading] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      userMessage: "",
    },

    validate: {
      userMessage: isNotEmpty("Please include a message"),
    },
  });

  // send message to specified userId (admin)
  const handleSendMessage = (values) => {
    setButtonLoading(true);
    const { userMessage } = values;
    const sent = sendMessage(import.meta.env.VITE_SUPPORT_ID, userMessage);
    sent
      ? form.reset()
      : form.setErrors({
          userMessage: "Couldn't send message, please try again later",
        });

    setTimeout(() => {
      setButtonLoading(false);
    }, 500);
  };

  // logs to understand data structure
  useEffect(() => {
    console.log("MESSAGES chatBox: ", messages);
    console.log("Object keys: ", Object.keys(messages));
    const messagesPerSender = Object.keys(messages);
    if (messagesPerSender) {
      messagesPerSender.map((senderId) =>
        console.log("messages per id: ", messages[senderId])
      );
    }
    console.log("object entries: ", Object.entries(messages));
    console.log("object entries[0]: ", Object.entries(messages)[0]);

    // user can only receive messages from one id (admin)
    // meaning the first entry should be the id of sender and the list of messages sent
    const firstPair = Object.entries(messages)[0];
    if (firstPair) {
      console.log("object messages: ", firstPair[1]);

      // store recipientId in reference (currently not used)
      recipientId.current = firstPair[0];

      // set messages in state var to render in component
      setReceivedMessages(firstPair[1]);
    }
    return () => {
      setReceivedMessages([]);
    };
  }, [messages, currentUser]);

  return (
    <>
      <Dialog opened={openedChat} withCloseButton onClose={closeChat}>
        <ScrollArea.Autosize type="auto" mah={200} pt={15}>
          {receivedMessages.map((msg, index) => (
            <div key={index}>
              <Text fw={700} span>
                {msg.username}
              </Text>
              <Text>{msg.content}</Text>
            </div>
          ))}
        </ScrollArea.Autosize>

        <form autoComplete="off" onSubmit={form.onSubmit(handleSendMessage)}>
          <TextInput
            {...form.getInputProps("userMessage")}
            key={form.key("userMessage")}
            label="Ask for support"
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
      </Dialog>
    </>
  );
};

export default ChatBox;
