import { useContext, useEffect } from "react";
import { SessionContext } from "../contexts/SessionContext";

const WebSocketProvider = () => {
  const { isAuthenticated, currentUser } = useContext(SessionContext);

  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      return;
    }
    console.log("CURRENT USER: ", currentUser)
    const socket = new WebSocket(`${import.meta.env.VITE_WS_URL}userId=${currentUser}`);

    socket.onopen = () => {
      console.log("CONNECTED TO WS");
    };

    socket.onmessage = (event) => {
      console.log("WS MESSAGE: ", event.data);
    };

    socket.onclose = () => {
      console.log("DISCONNECTED FROM WS");
    };

    return () => {
        socket.close();
    }
  }, [currentUser, isAuthenticated]);

  return null;
};

export default WebSocketProvider;
