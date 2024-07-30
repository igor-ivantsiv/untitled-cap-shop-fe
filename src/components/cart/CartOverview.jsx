import { useContext, useEffect, useState } from "react";
import useCartHelpers from "./cartHelpers";
import { SessionContext } from "../../contexts/SessionContext";
import CartProduct from "./CartProduct";
import { Group, NumberFormatter, Stack, Text } from "@mantine/core";


// cartContent: [{quantity: 1, variantId: {_id, productId, price, etc}, _id: "id"}]

const CartOverview = () => {
  const { currentUser } = useContext(SessionContext);
  const [cartContent, setCartContent] = useState([]);
  const [fetchedCart, setFetchedCart] = useState();
  const [totalPrice, setTotalPrice] = useState(0);
  const { fetchCart } = useCartHelpers();

  // fetch cart from backend on mount
  useEffect(() => {
    const displayCart = async () => {
      await fetchCart(currentUser, setFetchedCart);
    };

    displayCart();
  }, []);

  // log fetched cart for debugging
  useEffect(() => {
    console.log("Cart fetched: ", fetchedCart);
  }, [fetchedCart]);

  // set array of content when cart has been fetched
  useEffect(() => {
    if (fetchedCart) {
      setCartContent(fetchedCart.content);
      console.log("Cart content set: ", cartContent);
    }
  }, [fetchedCart]);

  // pass function down to component to reflect quantity change in total price
  const onQuantityChange = (id, newQuantity) => {
    setCartContent((prevState) =>
      prevState.map((item) =>
        item._id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // display the total price in cart
  useEffect(() => {
    const displayTotalPrice = () => {
      const total = cartContent.reduce(
        (acc, item) => acc + item.variantId.price * item.quantity,
        0
      );
      setTotalPrice(total);
    };
    displayTotalPrice();
  }, [cartContent]);

  // filter item out of array on delete
  const onDelete = (id) => {
    setCartContent((prevState) => prevState.filter((item) => item._id !== id));
  };

  return (
    <>
      {cartContent.map((product) => (
        <CartProduct
          key={product._id}
          product={product}
          onDelete={onDelete}
          onQuantityChange={onQuantityChange}
        />
      ))}
      {cartContent.length > 0 ? (
        <Stack>
          <Group>
            <Text>Total: </Text>
            <NumberFormatter
              prefix="$"
              value={totalPrice / 100}
              decimalScale={2}
            />
          </Group>
        </Stack>
      ) : (
        <Text fs="italic">Nothing here yet...</Text>
      )}
    </>
  );
};

export default CartOverview;
