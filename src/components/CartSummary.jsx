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

const CartSummary = () => {
  const { cartState, cartDispatch } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // get total price based on products list
  useEffect(() => {
    console.log("cart: ", cartState);
    const sum = products.reduce((acc, value) => acc + value.itemTotal, 0);
    setTotalPrice(sum);
    console.log("total sum: ", sum);
  }, [products]);

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

  // remove item from shopping cart
  const removeItem = (itemId) => {
    const updatedProducts = products.filter((item) => item._id !== itemId);
    cartDispatch({ type: "remove_item", payload: itemId });
    setProducts(updatedProducts);
  };

  return (
    <>
      {products.map((item) => (
        <Grid key={item._id} align="flex-start" justify="center">
          <Grid.Col span={3}>
            <Image src={item.imageUrl} />
          </Grid.Col>
          <Grid.Col span={3}>
            <Text>{item.productId.name}</Text>
          </Grid.Col>
          <Grid.Col span={3}>
            <NumberInput
              label="Amount"
              value={item.quantity}
              onChange={(event) => updateQuantity(event, item._id)}
              min={1}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <NumberFormatter
              prefix="$"
              value={(item.price / 100) * item.quantity}
              decimalScale={2}
            />
          </Grid.Col>
          <Grid.Col span={1}>
            <Button size="compact-xs" onClick={() => removeItem(item._id)}>
              X
            </Button>
          </Grid.Col>
        </Grid>
      ))}
      <div>Total price: {totalPrice}</div>
    </>
  );
};

export default CartSummary;
