import { createContext, useContext, useEffect, useState } from "react";
import { SessionContext } from "../contexts/SessionContext";

export const WebSocketContext = createContext();

const WebSocketProvider = ({ children }) => {
  const { isAuthenticated, currentUser, fetchWithToken } =
    useContext(SessionContext);

  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);

  const retrieveCart = async (userId, storedCart) => {
    const retrievedUserCart = await fetchWithToken(
      `/cart/${userId}/set`,
      "PUT",
      {
        cartContent: storedCart,
      }
    );
    console.log("WS CART RETRIEVED: ", retrievedUserCart);
  };

  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      return;
    }
    console.log("CURRENT USER: ", currentUser);
    const socket = new WebSocket(
      `${import.meta.env.VITE_WS_URL}userId=${currentUser}`
    );

    socket.onopen = () => {
      console.log("CONNECTED TO WS");

      // check session storage if there was a cart
      const userCartStr = sessionStorage.getItem("cartContent");
      const userCart = JSON.parse(userCartStr);
      console.log("WS STORED CART: ", userCart);

      // set cart back in db if found in session storage (restoring cart)
      if (userCart && userCart.length > 0) {
        retrieveCart(currentUser, userCart);
      }
    };

    // parse message, add to messages
    socket.onmessage = (event) => {
      console.log("WS MESSAGE: ", event.data);
      const message = JSON.parse(event.data);
      console.log("SENDER ID: ", message["senderId"])
      const senderId = message["senderId"];
      //setMessages((prevState) => [...prevState, message]);
      setMessages((prevState) => {
        if(!prevState[senderId]) {
          prevState[senderId] = []
        }
        return {...prevState, [senderId]: [...prevState[senderId], message]}
      })
    };

    socket.onclose = () => {
      console.log("DISCONNECTED FROM WS");
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [currentUser, isAuthenticated]);

  return (
    <WebSocketContext.Provider value={{ ws, messages }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
