import { createContext, useContext, useEffect, useReducer} from "react";
import { SessionContext } from "./SessionContext";

export const CartContext = createContext();
/*
// {
items: [{item: id, quantity: 1, priceTotal: p * q}]
*/
const initialCart = JSON.parse(sessionStorage.getItem("cartItems")) || [];

// add requests to increase/decrease stock
const cartReducer = (state, action) => {
  switch (action.type) {
    case "add_item": {
      const existingItemIndex = state.findIndex(
        (element) => element.item === action.payload.item
      );
      if (existingItemIndex >= 0) {
        const existingItem = state[existingItemIndex];

        const updatedItem = {
          item: action.payload.item,
          quantity: existingItem.quantity + 1,
        };
        const updatedState = state.toSpliced(existingItemIndex, 1, updatedItem);
        return updatedState;
      } else {
        return [...state, action.payload];
      }
      /*
      const updatedItems = [...state, action.payload];
      console.log("added to cart: ", updatedItems);
      return updatedItems;
      */
    }
    case "change_quantity": {
      const updatedItems = state.map((element) => {
        if (element.item === action.payload.item) {
          const updatedQuantity = action.payload.quantity;
          console.log(
            `updated ${action.payload.item} quantity: ${updatedQuantity}`
          );
          return { ...element, quantity: updatedQuantity };
        }
        return element;
      });
      return updatedItems;
    }
    case "remove_item": {
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

  const updateVirtualStock = async (endpoint, method = "GET", payload) => {

    try {
      const data = await fetchWithToken(endpoint, method, payload);
      console.log("virtual stock response: ", data);
      if (!data) {
        throw new Error("error updating stock")
      }
      if (data.virtualStock <= 0) {
        return "unavailable";
      }
      return "success";
    } catch (error) {
      console.error(error);
      return "error"
    }
  };

  useEffect(() => {
    sessionStorage.setItem("cartItems", JSON.stringify(cartState));
  }, [cartState]);

  return (
    <CartContext.Provider
      value={{ cartDispatch, cartState, updateVirtualStock}}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContextProvider;
