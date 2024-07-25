import { useContext, useEffect, useState } from "react";
import { CartContext } from "../contexts/CartContext";

import CartItem from "./CartItem";
import { useRefetchContext } from "../contexts/RefetchContext";
import { SessionContext } from "../contexts/SessionContext";
import { Button, Group, NumberFormatter, Stack, Text } from "@mantine/core";
import { IconCashRegister } from "@tabler/icons-react";
import { Link } from "react-router-dom";

const CartSummary = () => {
  const { cartState, cartDispatch } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const { fetchWithToken } = useContext(SessionContext);

  const { shouldRefetch } = useRefetchContext();

  // get current prices from db
  useEffect(() => {
    const fetchPrice = async (variantId, quantity) => {
      try {
        const data = await fetchWithToken(`/products/variants/${variantId}`);

        if (!data) {
          throw new Error("error fetching products in cart summary");
        }

        // update cart to reflect most current prices
        cartDispatch({
          type: "update_price",
          payload: { id: variantId, salesPrice: data.price },
        });
      } catch (error) {
        console.error(error);
      }
    };

    // update prices for each item in cart
    if (cartState.length > 0) {
      cartState.forEach((element) => {
        fetchPrice(element.id, element.quantity);
      });
    }
  }, []);

  // calculate total price for items in cart
  // update each time cart updates
  useEffect(() => {
    const totalCartPrice = cartState.reduce(
      (acc, item) => acc + item.salesPrice * item.quantity,
      0
    );
    setTotalPrice(totalCartPrice);
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
        if (!fetchedProductIds.has(element.id)) {
          const productData = await fetchProduct(element.id, element.quantity);
          // if fetch went through, add id to set, add item to array
          if (productData) {
            fetchedProductIds.add(element.id);
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

          <Button
            component={Link}
            to={"/checkout"}
            rightSection={<IconCashRegister />}
          >
            Checkout
          </Button>
        </Stack>
      ) : (
        <Text fs="italic">Nothing here yet...</Text>
      )}
    </>
  );
};

export default CartSummary;
