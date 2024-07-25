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

  // fetch one product by id
  const fetchProduct = async (variantId, quantity) => {
    try {
      const data = await fetchWithToken(`/products/variants/${variantId}`);

      if (!data) {
        throw new Error("error fetching products in cart summary");
      }
      // return new object with quantity prop
      return { ...data, quantity };
    } catch (error) {
      // return null if something went wrong fetching
      console.error(error);
      return null;
    }
  };

  // fetch products in cart
  useEffect(() => {
    // ensure only unique ids
    const fetchedProductIds = new Set();

    // fetch products and add to array
    const fetchProducts = async () => {
      const fetchedProducts = [];
      // loop over elements (products) in cart
      for (const element of cartState) {
        // check if id not already in ids Set
        if (!fetchedProductIds.has(element.item)) {
          const productData = await fetchProduct(
            element.item,
            element.quantity
          );
          // if fetch went through, add id to set, add item to array
          if (productData) {
            fetchedProductIds.add(element.item);
            fetchedProducts.push(productData);
          }
        }
      }
      // set product state
      setProducts(fetchedProducts);
    };

    fetchProducts();

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
