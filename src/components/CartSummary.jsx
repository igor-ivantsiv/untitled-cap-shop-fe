import { useContext, useEffect, useState } from "react";
import { CartContext } from "../contexts/CartContext";

import CartItem from "./CartItem";
import { useRefetchContext } from "../contexts/RefetchContext";
import { SessionContext } from "../contexts/SessionContext";

const CartSummary = () => {
  const { cartState } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const { fetchWithToken } = useContext(SessionContext)

  const { shouldRefetch } = useRefetchContext();

  // calculate total price
  useEffect(() => {
    const fetchPrice = async (variantId, quantity) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products/variants/${variantId}`
        );

        if (!response.ok) {
          throw new Error("server response not ok");
        }

        const data = await response.json();
        //console.log("product data: ", data);

        const itemTotal = quantity * data.price;
        setTotalPrice((prevState) => prevState + itemTotal);
      } catch (error) {
        console.error(error);
      }
    };

    if (cartState.length === 0) {
      setTotalPrice(0);
    } else {
      cartState.forEach((element) => {
        setTotalPrice(0);
        fetchPrice(element.item, element.quantity);
      });
    }
  }, [cartState]);

  // fetch products in cart
  useEffect(() => {
    const fetchProduct = async (variantId, quantity) => {
      try {
        /*
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products/variants/${variantId}`
        );

        if (!response.ok) {
          throw new Error("server response not ok");
        }

        const data = await response.json();
        //console.log("product data: ", data);
*/
        const data = await fetchWithToken(`/products/variants/${variantId}`)

        if (!data) {
          throw new Error("error fetching products in cart summary")
        }
        
        // create new object with quantity prop
        const shoppingData = { ...data, quantity };

        // add to list of products
        setProducts((prevState) => [...prevState, shoppingData]);
      } catch (error) {
        console.error(error);
      }
    };
    
    setProducts([]);
    cartState.forEach((product) => {
      fetchProduct(product.item, product.quantity);
    });

    // refetch on delete of item
  }, [shouldRefetch]);

  /*
  useEffect(() => {
    const fetchProduct = async (variantId, quantity) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products/variants/${variantId}`
        );

        if (!response.ok) {
          throw new Error("server response not ok");
        }

        const data = await response.json();
        console.log("product data: ", data);

        // get item total price
        const itemTotal = quantity * data.price;
        console.log("item total: ", itemTotal);

        // create new object with quantity and total prop
        const shoppingData = { ...data, quantity, itemTotal };

        // add to list of products
        setProducts((prevState) => [...prevState, shoppingData]);
      } catch (error) {
        console.error(error);
      }
    };

    if (cartState && cartState.length > 0) {
      setProducts([])
      cartState.forEach((product) => {
        fetchProduct(product.item, product.quantity);
      });
    }
  }, [shouldRefetch]);

  */

  return (
    <>
      {products.map((item) => (
        <CartItem product={item} key={item._id} />
      ))}
      <div>Total price: {totalPrice}</div>
    </>
  );
};

export default CartSummary;
