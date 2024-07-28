import { useContext, useState } from "react";
import { WebSocketContext } from "./WebSocketProvider";

const ChatBox = ({ recipientId }) => {
  const { ws, messages } = useContext(WebSocketContext);
  const [input, setInput] = useState("");

  // send message to specified userId
  const sendMessage = () => {
    if (ws) {
      ws.send(JSON.stringify({ type: "CHAT", recipientId, content: input }));
      setInput("");
    }
  };

  return (
    <div>
      {messages.map((msg, index) => (
        <div key={index}>
          {msg.username}: {msg.content}
        </div>
      ))}
      <input type="text" value={input} onChange={(e) => setInput(e.target.value)}/>
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatBox;
