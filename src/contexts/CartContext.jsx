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
    case "change_quantity": {
      // create new array from state, match id to provided id, update quantity
      const existingItemIndex = state.findIndex(
        (element) => element.id === action.payload.id
      );
      if (existingItemIndex >= 0) {
        const existingItem = state[existingItemIndex];

        const updatedItem = {
          id: action.payload.item,
          quantity: existingItem.quantity - 1,
          salesPrice: existingItem.salesPrice,
          productId: existingItem.productId,
        };
        // return array with new object replacing updated item
        const updatedState = state.toSpliced(existingItemIndex, 1, updatedItem);
        return updatedState;
      }
      else {
        return state
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
      console.log("array after removing items: ", updatedItems)
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
      }
      else {
        return state
      }
    }
    /*
    case "clear_cart": {

    }
    */
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
            variantId: element.id,
            quantity: element.quantity,
          });
        })
      );
    } catch (error) {
      console.error("error dereserving all: ", error);
    }
  };
  /*
  // add event listener to window -> dereserve items on session end
  useEffect(() => {
    const handleBeforeUnload = async () => {
      const isReloading = sessionStorage.getItem("isReloading");
      if (!isReloading) {
        await dereserveItems();
        sessionStorage.removeItem("cartItems");
      } else {
        sessionStorage.removeItem("isReloading");
      }
    };
    console.log("event listener added");
    window.addEventListener("beforeunload", handleBeforeUnload);

    sessionStorage.setItem("isReloading", "true");

    return () => {
      console.log("event listener removed");
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [cartState]);
*/
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
