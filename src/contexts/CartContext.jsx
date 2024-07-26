import { createContext, useContext, useEffect, useReducer } from "react";
import { SessionContext } from "./SessionContext";

export const CartContext = createContext();
/*
cartState = [{id: _id, quantity: 1, salesPrice: 1, productId: productId}]
*/
const initialCart = JSON.parse(sessionStorage.getItem("cartItems")) || [];

// perform all operations on cart state
const cartReducer = (state, action) => {
  switch (action.type) {
    case "add_item": {
      // check if item already in cart
      const existingItemIndex = state.findIndex(
        (element) => element.id === action.payload.id
      );
      // if item found, add 1 to quantity
      if (existingItemIndex >= 0) {
        const existingItem = state[existingItemIndex];

        const updatedItem = {
          id: existingItem.id,
          quantity: existingItem.quantity + 1,
          salesPrice: existingItem.salesPrice,
          productId: existingItem.productId,
        };
        // return array with new object replacing updated item
        const updatedState = state.toSpliced(existingItemIndex, 1, updatedItem);
        return updatedState;
        // if no item was found -> add new item to cart
      } else {
        return [...state, action.payload];
      }
    }

    // decrease quantity
    case "decrease_quantity": {
      // create new array from state, match id to provided id, update quantity
      const existingItemIndex = state.findIndex(
        (element) => element.id === action.payload.id
      );
      if (existingItemIndex >= 0) {
        const existingItem = state[existingItemIndex];

        const updatedItem = {
          id: existingItem.id,
          quantity: existingItem.quantity - 1,
          salesPrice: existingItem.salesPrice,
          productId: existingItem.productId,
        };
        // return array with new object replacing updated item
        const updatedState = state.toSpliced(existingItemIndex, 1, updatedItem);
        return updatedState;
      } else {
        return state;
      }
      /*
      const updatedItems = state.map((element) => {
        if (element.item === action.payload.item) {
          const updatedQuantity = action.payload.quantity;
          return { ...element, quantity: updatedQuantity };
        }
        return element;
      });
      return updatedItems;
      */
    }
    case "remove_item": {
      // filter out element by provided id
      const updatedItems = state.filter(
        (element) => element.id !== action.payload.id
      );
      console.log("array after removing items: ", updatedItems);
      return updatedItems;
    }
    case "update_price": {
      const existingItemIndex = state.findIndex(
        (element) => element.id === action.payload.id
      );
      if (existingItemIndex >= 0) {
        const existingItem = state[existingItemIndex];

        const updatedItem = {
          id: existingItem.id,
          quantity: existingItem.quantity,
          salesPrice: action.payload.salesPrice,
          productId: existingItem.productId,
        };
        // return array with new object replacing updated item
        const updatedState = state.toSpliced(existingItemIndex, 1, updatedItem);
        return updatedState;
      } else {
        return state;
      }
    }
    case "clear_cart": {
      const clearedCart = [];
      sessionStorage.removeItem("cartItems");
      return clearedCart;
    }
  }
};

const CartContextProvider = ({ children }) => {
  const [cartState, cartDispatch] = useReducer(cartReducer, initialCart);

  const { fetchWithToken } = useContext(SessionContext);

  // dereserve all items when session ends
  const dereserveItems = async () => {
    try {
      await Promise.all(
        cartState.map((element) => {
          fetchWithToken(`/stocks/dereservation/${element.id}`, "PUT", {
            quantity: element.quantity,
          });
        })
      );
      console.log("ITEMS DERESERVED");
    } catch (error) {
      console.error("error dereserving all: ", error);
    }
  };

  // reserve items if page was reloaded and cart still has content
  const reserveItems = async () => {
    try {
      await Promise.all(
        cartState.map((element) => {
          fetchWithToken(`/stocks/reservation/${element.id}`, "PUT", {
            quantity: element.quantity,
          });
        })
      );
      console.log("ITEMS RESERVED");
    } catch (error) {
      console.error("error reserving all: ", error);
    }
  };

  // update virtual stock, return response based on stock availability
  const updateVirtualStock = async (endpoint, method = "GET", payload) => {
    try {
      const data = await fetchWithToken(endpoint, method, payload);
      console.log("virtual stock response: ", data);
      if (!data) {
        throw new Error("error updating stock");
      }
      if (data.virtualStock <= 0) {
        return "unavailable";
      }
      return "success";
    } catch (error) {
      console.error(error);
      return "error";
    }
  };

  const reserveAll = async () => {
    sessionStorage.removeItem("StockDecrease");
    sessionStorage.removeItem("StockIncrease");
    try {
      const data = await fetchWithToken(`/stocks/reservations/all`, "PUT", {
        itemsArr: cartState,
      });
      if (data.message) {
        sessionStorage.setItem("StockDecrease", "true");
        console.log("SERVER RESPONSE: ", data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const dereserveAll = async () => {
    sessionStorage.removeItem("StockIncrease");
    sessionStorage.removeItem("StockDecrease");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/stocks/dereservations/all`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemsArr: cartState }),
        }
      );
      const data = await response.json();
      if (data.message) {
        sessionStorage.setItem("StockIncrease", "true");
        console.log("SERVER RESPONSE: ", data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const dereserveAndSetStorage = async () => {
    sessionStorage.removeItem("StockIncrease");
    sessionStorage.removeItem("StockDecrease");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/stocks/dereservations/all`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemsArr: cartState }),
        }
      );
      const data = await response.json();
      if (data.message) {
        sessionStorage.setItem("StockIncrease", "true");
        console.log("SERVER RESPONSE: ", data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // add event listener to window -> dereserve items on session end
  useEffect(() => {
    // dereserve all items in cart (if user leaves page)
    const handleBeforeUnload = async () => {
      await dereserveItems();
    };

    // might have to check which items need re-reservation
    const handleLoad = async () => {
      if (cartState && cartState.length > 0) {
        const stockIncreased = sessionStorage.getItem("StockIncrease");
        console.log("LOAD -> stock increased: ", stockIncreased);
        if (stockIncreased) {
          await reserveAll();
          sessionStorage.removeItem("StockIncrease")
          sessionStorage.removeItem("StockDecrease")
        }
      }
    };

    // works reliable for closing page and switching tabs
    // not always reliable on reload
    const handleReload = async () => {
      console.log("VISIBILITY CHANGE: ", document.visibilityState);
      if (document.visibilityState === "visible") {
        if (cartState && cartState.length > 0) {
          const itemsDereserved = sessionStorage.getItem("StockIncrease");
          console.log("!!!! StockIncrease: ", itemsDereserved);
          if (itemsDereserved) {
            await reserveAll();
          } else {
            sessionStorage.removeItem("StockIncrease");
          }
        }
      } else {
        //sessionStorage.setItem("hasReloaded", "true");
        if (cartState && cartState.length > 0) {
          await dereserveAll();
          sessionStorage.setItem("StockIncrease", "true");
        }
      }
    };

    console.log("event listener -> visibility change");
    document.addEventListener("visibilitychange", handleReload);
    window.addEventListener("load", handleLoad);

    window.addEventListener("beforeunload", (event) => {
      event.preventDefault()
    })

    return () => {
      console.log("event listeners removed");
      //window.removeEventListener("beforeunload");
      //window.removeEventListener("load", handleLoad);
      document.removeEventListener("visibilitychange", handleReload);
    };
  }, [cartState]);

  // store cart in session storage
  useEffect(() => {
    sessionStorage.setItem("cartItems", JSON.stringify(cartState));
  }, [cartState]);

  return (
    <CartContext.Provider
      value={{ cartDispatch, cartState, updateVirtualStock }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContextProvider;
