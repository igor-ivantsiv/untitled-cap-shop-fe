import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { SessionContext } from "../contexts/SessionContext";

export const WebSocketContext = createContext();

const WebSocketProvider = ({ children }) => {
  const { isAuthenticated, currentUser, fetchWithToken, token } =
    useContext(SessionContext);

  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState({});
  const reconnectAttempts = useRef(0);
  const reconnectTimeout = useRef(null);
  const isAuthenticatedRef = useRef(isAuthenticated)

  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated
  }, [isAuthenticated])

  // retrieve user cart if there was a disconnect (refill cart in db)
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

  // turned the ws connection into a callback function
  const connect = useCallback(() => {

    // clear the reconnect timeout when function is called
    clearTimeout(reconnectTimeout.current);
    if (!isAuthenticated || !currentUser || !token) {
      return;
    }
    console.log("CURRENT USER: ", currentUser);
    const socket = new WebSocket(
      `${import.meta.env.VITE_WS_URL}userId=${currentUser}&token=${token}`
    );

    socket.onopen = () => {
      console.log("CONNECTED TO WS");

      // set reconnect attempts to 0
      reconnectAttempts.current = 0;

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
      console.log("SENDER ID: ", message["senderId"]);
      const senderId = message["senderId"];

      // if the current sender Id does not have a key yet, set key to empty array
      setMessages((prevState) => {
        if (!prevState[senderId]) {
          prevState[senderId] = [];
        }
        // update the state by including current senders message to its array of messages
        return { ...prevState, [senderId]: [...prevState[senderId], message] };
      });
    };

    socket.onclose = () => {
      console.log("DISCONNECTED FROM WS");

      // only attempt reconnect if user is authenticated, and try only 5 times
      if (reconnectAttempts.current < 5 && isAuthenticatedRef.current) {
        console.log("WS ATTEMPTING RECONNECT");

        // attempt after 5 seconds
        reconnectTimeout.current = setTimeout(() => {
          // attempt reconnect only when user is still authenticated after timeout
          if (isAuthenticatedRef.current) {
            reconnectAttempts.current += 1;
            connect();
          }
        }, 5000);
      }
    };

    socket.onerror = (error) => {
      console.error("WS ERROR: ", error);
      socket.close();
    };

    setWs(socket);
  }, [currentUser, isAuthenticated]);

  useEffect(() => {
    // if user is authenticated -> connect
    if (isAuthenticated) {
      connect();
    } else {
      // clear timeout if user is not authenticated 
      // (maybe not necessary)
      // close ws 
      clearTimeout(reconnectTimeout.current);
      if (ws) {
        ws.close();
      }
    }

    return () => {
      if (ws) {
        ws.close();
      }
      clearTimeout(reconnectTimeout.current)
    };
  }, [currentUser, isAuthenticated]);


  // send message to specified recipient
  const sendMessage = useCallback(
    (recipientId, content) => {
      if (ws) {
        const message = { type: "CHAT", recipientId, content };
        ws.send(JSON.stringify(message));

        // save the sent message to conversation
        const sentMessage = { type: "CHAT", username: "You", content };
        setMessages((prevState) => {
          // if this user id does not yet have a prop, set to empty array
          if (!prevState[recipientId]) {
            prevState[recipientId] = [];
          }
          // update the state by including current senders message to its array of messages
          return {
            ...prevState,
            [recipientId]: [...prevState[recipientId], sentMessage],
          };
        });
        return 1;
      }
      return 0;
    },
    [ws]
  );

  useEffect(() => {
    if (!currentUser) {
      setMessages({});
    }
  }, [currentUser]);

  return (
    <WebSocketContext.Provider value={{ ws, messages, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
