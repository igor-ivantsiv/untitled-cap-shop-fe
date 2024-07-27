import { useContext, useEffect, useState } from "react";
import useCartHelpers from "./cartHelpers";
import { SessionContext } from "../../contexts/SessionContext";
import CartProduct from "./CartProduct";
import { Button, Group, NumberFormatter, Stack, Text } from "@mantine/core";
import { IconCashRegister } from "@tabler/icons-react";
import { Link } from "react-router-dom";

// have a recalculate price function, pass down to components
// handle quantity change
// save total price in overview in state

/*
  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };
*/

const CartOverview = () => {
  const { currentUser } = useContext(SessionContext);
  const [cartContent, setCartContent] = useState([]);
  const [fetchedCart, setFetchedCart] = useState();
  const { fetchCart } = useCartHelpers();

  useEffect(() => {
    const displayCart = async () => {
      await fetchCart(currentUser, setFetchedCart);
      console.log("Cart fetched: ", fetchedCart);
    };

    displayCart();
  }, []);

  useEffect(() => {
    console.log("Cart overview: ", fetchedCart);
  }, [fetchedCart]);

  useEffect(() => {
    if (fetchedCart) {
      setCartContent(fetchedCart.content);
    }
  }, [fetchedCart]);

  const onDelete = (id) => {
    setCartContent((prevState) => prevState.filter((item) => item._id !== id));
  };

  return (
    <>
      {cartContent.map((product) => (
        <CartProduct key={product._id} product={product} onDelete={onDelete} />
      ))}
      {cartContent.length > 0 ? (
        <Stack>
          <Group>
            <Text>Total: </Text>
            <NumberFormatter
              prefix="$"
              value={100 / 100}
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

export default CartOverview;
