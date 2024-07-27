import { useContext, useEffect, useState } from "react";
import useCartHelpers from "./cartHelpers";
import { SessionContext } from "../../contexts/SessionContext";
import CartProduct from "./CartProduct";
import { Text } from "@mantine/core";

const CartOverview = () => {
  const { currentUser } = useContext(SessionContext);
  const [cartContent, setCartContent] = useState([]);
  const [fetchedCart, setFetchedCart] = useState()
  const {  fetchCart } = useCartHelpers();

  useEffect(() => {
    const displayCart = async () => {
      await fetchCart(currentUser, setFetchedCart);
      console.log("Cart fetched: ", fetchedCart);
      //setCartContent(content);
    };

    displayCart();
  }, []);

  useEffect(() => {
    console.log("Cart overview: ", fetchedCart);
  }, [fetchedCart]);

  useEffect(() => {
    if (fetchedCart) {
        setCartContent(fetchedCart.content)
    }

  }, [fetchedCart])

  const onDelete = (id) => {
    setCartContent((prevState) => (prevState.filter((item) => item._id !== id)));
  };

  return (
    <>
      {cartContent.length > 0 ? (
        cartContent.map((product) => (
          <CartProduct
            key={product._id}
            product={product}
            onDelete={onDelete}
          />
        ))
      ) : (
        <Text fs="italic">Nothing here yet...</Text>
      )}
    </>
  );
};

export default CartOverview;
