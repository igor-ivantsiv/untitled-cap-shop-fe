import { useContext, useEffect, useState } from "react";
import { WebSocketContext } from "./WebSocketProvider";

// work in progress
const ChatBoxAdmin = ({ recipientId, messagesReceived }) => {
  const { ws } = useContext(WebSocketContext);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (ws) {
      ws.send(JSON.stringify({ type: "CHAT", recipientId, content: input }));
      setInput("");
    }
  };

  useEffect(() => {
    console.log("MESSAGES: ", messagesReceived)
  }, [messagesReceived])

  return (
    <div>
      {messagesReceived.map((msg, index) => (
        <div key={index}>
          {msg.username}: {msg.content}
        </div>
      ))}
      <input type="text" value={input} onChange={(e) => setInput(e.target.value)}/>
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatBoxAdmin;
