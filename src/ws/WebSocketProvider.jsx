import { useContext, useEffect } from "react";
import { SessionContext } from "../contexts/SessionContext";

const WebSocketProvider = () => {
  const { isAuthenticated, currentUser, fetchWithToken } =
    useContext(SessionContext);

  const retrieveCart = async (userId, storedCart) => {
    const retrievedUserCart = await fetchWithToken(
      `/cart/${userId}/set`,
      "PUT",
      {
        cartContent: storedCart,
      }
    );
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

      const userCartStr = sessionStorage.getItem("cartContent");
      const userCart = JSON.parse(userCartStr);
      console.log("STORED CART: ", userCart)
      if (userCart && userCart.length > 0) {
        console.log("STORED CART: ", userCart)
        retrieveCart(currentUser, userCart);
      }
    };

    socket.onmessage = (event) => {
      console.log("WS MESSAGE: ", event.data);
    };

    socket.onclose = () => {
      console.log("DISCONNECTED FROM WS");
    };

    return () => {
      socket.close();
    };
  }, [currentUser, isAuthenticated]);

  return null;
};

export default WebSocketProvider;
