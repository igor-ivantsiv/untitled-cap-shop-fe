import { createContext, useContext, useEffect, useReducer } from "react";
import { SessionContext } from "./SessionContext";

export const CartContext = createContext();
/*
cartState = [{item: _id, quantity: 1}]
*/
const initialCart = JSON.parse(sessionStorage.getItem("cartItems")) || [];

// perform all operations on cart state
const cartReducer = (state, action) => {
  switch (action.type) {
    case "add_item": {
      // check if item already in cart
      const existingItemIndex = state.findIndex(
        (element) => element.item === action.payload.item
      );
      // if item found, add 1 to quantity
      if (existingItemIndex >= 0) {
        const existingItem = state[existingItemIndex];

        const updatedItem = {
          item: action.payload.item,
          quantity: existingItem.quantity + 1,
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
    case "change_quantity": {
      // create new array from state, match id to provided id, update quantity
      const updatedItems = state.map((element) => {
        if (element.item === action.payload.item) {
          const updatedQuantity = action.payload.quantity;
          return { ...element, quantity: updatedQuantity };
        }
        return element;
      });
      return updatedItems;
    }
    case "remove_item": {
      // filter out element by provided id
      const updatedItems = state.filter(
        (element) => element.item !== action.payload
      );
      return updatedItems;
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
          fetchWithToken(`/stocks/dereservation/${element.item}`, "PUT", {
            variantId: element.item,
            quantity: element.quantity,
          });
        })
      );
    } catch (error) {
      console.error("error dereserving all: ", error);
    }
  };

  // add event listener to window -> dereserve items on session end
  useEffect(() => {
    const handleBeforeUnload = async () => {
      await dereserveItems();
      sessionStorage.removeItem("cartItems");
    };
    console.log("event listener added");
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      console.log("event listener removed");
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [cartState]);

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
