import { useContext } from "react";
import { SessionContext } from "../../contexts/SessionContext";
import { CartContext } from "./CartContext";

// each function will return 1: succces, 0: failure, or -1: stock issue
// cart and stock will be adjusted on the backend
// copy of cart on the front end will also be adjusted

const useCartHelpers = () => {
  const { fetchWithToken } = useContext(SessionContext);
  const { cartDispatch } = useContext(CartContext);

  // fetch the current user's cart
  const fetchCart = async (userId, setter) => {
    // ensure arguments
    if (!userId || !setter) {
      console.error("USER ID NOT PROVIDED -fetchCart");
      return 0;
    }

    try {
      // get cart
      const data = await fetchWithToken(`/cart/${userId}`);

      // return 1 for succes, 0 for failure
      if (data) {
        //console.log("CART FETCHED -fetchCart: ", data);
        setter(data);
        return 1;
      }
      return 0;
    } catch (error) {
      console.error("ERROR -fetchCart: ", error);
      return 0;
    }
  };

  // add item to cart on backend
  // return 1 for succes, 0 for error, -1 for stock issue
  const addItem = async (userId, variantId) => {
    // ensure arguments provided
    if (!userId || !variantId) {
      console.error("USER OR VARIANT ID NOT PROVIDED -useAddItem");
      return 0;
    }

    try {
      // get stock availability
      const stocksData = await fetchWithToken(`/stocks/${variantId}`);
      if (!stocksData) {
        throw new Error("STOCKS DATA NOT FOUND");
      }
      if (stocksData.virtualStock <= 0) {
        return -1;
      }

      // update cart
      const cartData = await fetchWithToken(`/cart/${userId}/add-item`, "PUT", {
        variantId,
        quantity: 1,
      });

      // return 1 if all went well
      if (cartData) {
        //console.log("ADDED ITEM -useAddItem: ", cartData);
        cartDispatch({
          type: "SET_CART",
          cart: cartData,
        });
        return 1;
      }
      // return 0 if any request failed
      return 0;
    } catch (error) {
      // log error and return 0 to indicate failure
      console.error("ERROR -useAddItem: ", error);
      return 0;
    }
  };

  // decrease item quantity by 1
  const decreaseItem = async (userId, variantId) => {
    // ensure arguments
    if (!userId || !variantId) {
      console.error("USER OR VARIANT ID NOT PROVIDED -decreaseItem");
      return 0;
    }

    try {
      // update cart
      const data = await fetchWithToken(
        `/cart/${userId}/decrease-item`,
        "PUT",
        {
          variantId,
          quantity: 1,
        }
      );

      // return 1 for succes, 0 for failure
      if (data) {
        //console.log("DECREASED ITEM -decreaseItem: ", data);
        cartDispatch({
          type: "SET_CART",
          cart: data,
        });
        return 1;
      }
      return 0;
    } catch (error) {
      console.error("ERROR -decreaseItem: ", error);
      return 0;
    }
  };

  // remove item from cart
  const removeItem = async (userId, variantId, quantity) => {
    // ensure arguments
    if (!userId || !variantId || !quantity) {
      console.error("ARGUMENT NOT PROVIDED -removeItem");
      return 0;
    }

    try {
      // update cart
      const data = await fetchWithToken(`/cart/${userId}/remove-item`, "PUT", {
        variantId,
        quantity,
      });

      // return 1 for succes, 0 for failure
      if (data) {
        //console.log("REMOVED ITEM -removeItem: ", data);
        cartDispatch({
          type: "SET_CART",
          cart: data,
        });
        return 1;
      }
      return 0;
    } catch (error) {
      console.error("ERROR -removeItem: ", error);
      return 0;
    }
  };

  // empty cart without restocking items
  const emptyCartAfterSale = async (userId) => {
    // ensure argument provided
    if (!userId) {
      console.error("ID NOT PROVIDED -emptyCartAfterSale");
      return 0;
    }
    try {
      // fetch correct cart for user
      const data = await fetchWithToken(`/cart/${userId}/empty-cart/sale`);

      // if success, set front end copy, return 1
      if (data) {
        //console.log("CART EMPTY -emptyCartAfterSale", data);
        cartDispatch({
          type: "SET_CART",
          cart: data,
        });
        return 1;
      }

      // return 0 in case of failure
      return 0;
    } catch (error) {
      console.error("ERROR -emptyCartAfterSale: ", error);
      return 0;
    }
  };

  const emptyCart = async (userId) => {
    // ensure argument provided
    if (!userId) {
      console.error("ID NOT PROVIDED -emptyCart");
      return 0;
    }
    try {
      // fetch correct cart for user
      const data = await fetchWithToken(`/cart/${userId}/empty-cart`);

      // if success, set front end copy, return 1
      if (data) {
        //console.log("CART EMPTY -emptyCart", data);
        cartDispatch({
          type: "SET_CART",
          cart: data,
        });
        return 1;
      }

      // return 0 in case of failure
      return 0;
    } catch (error) {
      console.error("ERROR -emptyCart: ", error);
      return 0;
    }
  };

  return {
    addItem,
    decreaseItem,
    removeItem,
    fetchCart,
    emptyCartAfterSale,
    emptyCart,
  };
};

export default useCartHelpers;
