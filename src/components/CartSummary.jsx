import { useContext, useEffect, useState } from "react";
import { CartContext } from "../contexts/CartContext";
import {
  Button,
  CloseButton,
  Grid,
  Group,
  Image,
  NumberFormatter,
  NumberInput,
  Text,
} from "@mantine/core";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";
import CartItem from "./CartItem";

const CartSummary = () => {
  const { cartState, cartDispatch, updateVirtualStock } =
    useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [buttonsLoading, setButtonsLoading] = useState({});
  const [increaseBtnDisabled, setIncreaseBtnDisabled] = useState();
  const [decreaseBtnDisabled, setDecreaseBtnDisabled] = useState();
  const [buttons, setButtons] = useState([]);

  // get total price based on products list
  useEffect(() => {
    console.log("cart: ", cartState);
    const sum = products.reduce((acc, value) => acc + value.itemTotal, 0);
    setTotalPrice(sum);
    console.log("total sum: ", sum);
  }, [products]);
  /*
  useEffect(() => {
    const buttonArr = products.map((item) => ({
      product: item._id,
      loading: false,
      increase: false,
      decrease: false,
    }));
    setButtons(buttonArr);
    console.log("button arr: ", buttons)
  }, [products]);
*/
  // fetch products in cart
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
      cartState.forEach((product) => {
        fetchProduct(product.item, product.quantity);
      });
    }
  }, []);

  // update quantity in shopping cart
  /*
  const updateQuantity = (event, itemId) => {
    console.log("products: ", products);
    console.log(`event: ${event}, id: ${itemId}`);
    cartDispatch({
      type: "change_quantity",
      payload: { item: itemId, quantity: event },
    });
    const updatedProducts = products.map((item) => {
      if (item._id === itemId) {
        const updatedItemTotal = item.price * event;
        const updatedItem = {
          ...item,
          quantity: event,
          itemTotal: updatedItemTotal,
        };
        return updatedItem;
      }
      return item;
    });

    setProducts(updatedProducts);
  };
*/

  const increaseQuantity = async (itemId) => {};

  const changeQuantity = (itemId, increase) => {
    const updatedProducts = products.map((item) => {
      if (item._id === itemId) {
        const updatedQuantity = increase
          ? item.quantity + 1
          : item.quantity - 1;
        const updatedItemTotal = item.price * updatedQuantity;
        const updatedItem = {
          ...item,
          quantity: updatedQuantity,
          itemTotal: updatedItemTotal,
        };
        cartDispatch({
          type: "change_quantity",
          payload: { item: itemId, quantity: updatedQuantity },
        });
        return updatedItem;
      }
      return item;
    });
    setProducts(updatedProducts);
  };

  // remove item from shopping cart
  const removeItem = async (itemId, quantity) => {
    const response = await updateVirtualStock(`/dereservation/${itemId}`);
    const updatedProducts = products.filter((item) => item._id !== itemId);
    cartDispatch({ type: "remove_item", payload: itemId });
    setProducts(updatedProducts);
  };

  return (
    <>
      {products.map((item) => (
          <CartItem product={item} key={item._id}/>
      ))}
      <div>Total price: {totalPrice}</div>
    </>
  );
};

export default CartSummary;
