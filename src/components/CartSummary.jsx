import { useContext, useEffect, useState } from "react";
import { CartContext } from "../contexts/CartContext";

import CartItem from "./CartItem";
import { useRefetchContext } from "../contexts/RefetchContext";
import { SessionContext } from "../contexts/SessionContext";
import { Button, Group, NumberFormatter, Stack, Text } from "@mantine/core";
import { IconCashRegister } from "@tabler/icons-react";

const CartSummary = () => {
  const { cartState } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const { fetchWithToken } = useContext(SessionContext);

  const { shouldRefetch } = useRefetchContext();

  // calculate total price
  useEffect(() => {
    const fetchPrice = async (variantId, quantity) => {
      try {
        const data = await fetchWithToken(`/products/variants/${variantId}`);

        if (!data) {
          throw new Error("error fetching products in cart summary");
        }

        const itemTotal = quantity * data.price;
        setTotalPrice((prevState) => prevState + itemTotal);
      } catch (error) {
        console.error(error);
      }
    };

    // first set total price to 0
    // calc total price by fetching price for each item in cart
    setTotalPrice(0);
    if (cartState.length > 0) {
      cartState.forEach((element) => {
        fetchPrice(element.item, element.quantity);
      });
    }
    // update every time cart changes
  }, [cartState]);

  // fetch products in cart
  useEffect(() => {
    const fetchProduct = async (variantId, quantity) => {
      try {
        const data = await fetchWithToken(`/products/variants/${variantId}`);

        if (!data) {
          throw new Error("error fetching products in cart summary");
        }

        // create new object with quantity prop
        const shoppingData = { ...data, quantity };

        // add to list of products
        setProducts((prevState) => [...prevState, shoppingData]);
      } catch (error) {
        console.error(error);
      }
    };

    // start with empty array, then fetch each product based on id stored in cart
    setProducts([]);
    cartState.forEach((product) => {
      fetchProduct(product.item, product.quantity);
    });

    // refetch on delete of item
  }, [shouldRefetch]);

  return (
    <>
      {products.map((item) => (
        <CartItem product={item} key={item._id} />
      ))}
      {products.length > 0 ? (
        <Stack>
          <Group>
            <Text>Total: </Text>
            <NumberFormatter
              prefix="$"
              value={totalPrice / 100}
              decimalScale={2}
            />
          </Group>
          <Button rightSection={<IconCashRegister />}>Checkout</Button>
        </Stack>
      ) : (
        <Text fs="italic">Nothing here yet...</Text>
      )}
    </>
  );
};

export default CartSummary;
