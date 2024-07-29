import { useContext, useEffect, useRef, useState } from "react";
import { WebSocketContext } from "./WebSocketProvider";
import { isNotEmpty, useForm } from "@mantine/form";
import { Button, TextInput } from "@mantine/core";

const ChatBox = () => {
  const { ws, messages } = useContext(WebSocketContext);
  const [input, setInput] = useState("");
  const recipientId = useRef("");
  const [receivedMessages, setReceivedMessages] = useState([]);

  const [buttonLoading, setButtonLoading] = useState(false)

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      userMessage: "",
    },

    validate: {
      userMessage: isNotEmpty("Please include a message"),
    },
  });

  // send message to specified userId
  const sendMessage =  (values) => {
    setButtonLoading(true);
    const { userMessage } = values
    if (ws) {
      ws.send(
        JSON.stringify({
          type: "CHAT",
          recipientId: "66a5653d6610617aae550e8f",
          content: userMessage,
        })
      );
      form.reset()
    }
    setTimeout(() => {
      setButtonLoading(false)
    }, 500)
  };

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
    const firstPair = Object.entries(messages)[0];
    if (firstPair) {
      console.log("object messages: ", firstPair[1]);
      recipientId.current = firstPair[0];
      setReceivedMessages(firstPair[1]);
    }
  }, [messages]);

  /*
  {messages.map((msg, index) => (
        <div key={index}>
          {msg.username}: {msg.content}
        </div>
      ))}

      <input type="text" value={input} onChange={(e) => setInput(e.target.value)}/>
      <button onClick={sendMessage}>Send</button>
  */

  return (
    <div>
      {receivedMessages.map((msg, index) => (
        <div key={index}>
          {msg.username}: {msg.content}
        </div>
      ))}

      
      <form autoComplete="off" onSubmit={form.onSubmit(sendMessage)}>
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
    </div>
  );
};

export default ChatBox;
