import { createContext, useEffect, useReducer } from "react";

export const CartContext = createContext();
/*
// {
items: [{item: id, quantity: 1}]
*/
const initialCart = JSON.parse(sessionStorage.getItem("cartItems")) || [];

// add requests to increase/decrease stock
const cartReducer = (state, action) => {
  switch (action.type) {
    case "add_item": {
      const updatedItems = [...state, action.payload];
      console.log("added to cart: ", updatedItems);
      return updatedItems;
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

  useEffect(() => {
    sessionStorage.setItem("cartItems", JSON.stringify(cartState));
  }, [cartState]);

  return (
    <CartContext.Provider value={{ cartDispatch, cartState }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContextProvider;
