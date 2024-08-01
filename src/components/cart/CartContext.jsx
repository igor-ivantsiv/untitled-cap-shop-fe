import { createContext, useEffect, useReducer } from "react";


export const CartContext = createContext();
/*
cartState = { userId: currentUser, cartContent: [{quantity: 1, variantId: id}]}
*/
const initialCart = JSON.parse(sessionStorage.getItem("cartContent")) || [];

const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_CART":
      const { content } = action.cart;
      return  content ;
    default:
      return state;
  }
};

const CartContextProvider = ({ children }) => {
  const [cartState, cartDispatch] = useReducer(cartReducer, initialCart);

  // store cart in session storage
  useEffect(() => {
    sessionStorage.setItem("cartContent", JSON.stringify(cartState));
  }, [cartState]);

  return (
    <CartContext.Provider value={{ cartDispatch, cartState }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContextProvider;
