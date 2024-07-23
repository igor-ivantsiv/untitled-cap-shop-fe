import { createContext, useReducer } from "react";

export const CartContext = createContext();
/*
// {
items: [{item: id, quantity: 1, totalPrice: item.price * quantity }], 
totalCartPrice: totalPrice,}
*/
const initialCart = [];

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
            console.log(`updated ${action.payload.item} quantity: ${updatedQuantity}`)
            element.quantity = updatedQuantity;
        }
        return element;
      });
      console.log("updated arr: ", updatedItems)
      return updatedItems
    }
  }
};

// update prices

const CartContextProvider = ({ children }) => {
  const [cartState, cartDispatch] = useReducer(cartReducer, initialCart);

  const addToCart = (variantId) => {
    // check if item is already in cart
    // reduce virtual stock
    // save id: 0 in cart
    // open cart
  };

  const changeQuantity = (variantId) => {
    // check virtual stock
    // reduce virtual stock
    // increase quantity
  };

  const removeFromCart = (variantId) => {
    // remove from cart
    // increase virtual stock
  };

  return (
    <CartContext.Provider value={{ cartDispatch, cartState }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContextProvider;
