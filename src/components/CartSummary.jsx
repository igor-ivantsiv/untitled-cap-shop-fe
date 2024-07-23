import { useContext, useEffect, useState } from "react";
import { CartContext } from "../contexts/CartContext";
import { Group, Image, NumberFormatter, NumberInput, Text } from "@mantine/core";

const CartSummary = () => {
  const { cartState, cartDispatch } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [quantity, setQuantity] = useState(0)

  useEffect(() => {
    const fetchProduct = async (variantId) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products/variants/${variantId}`
        );

        if (!response.ok) {
          throw new Error("server response not ok");
        }

        const data = await response.json();
        console.log("product data: ", data);

        setProducts((prevState) => [...prevState, data]);
      } catch (error) {
        console.error(error);
      }
    };

    if (cartState.length > 0) {
      cartState.forEach((product) => {
        fetchProduct(product.item);
      });
    }
  }, []);

  const updateQuantity = (event, itemId) => {
    console.log(`event: ${event}, id: ${itemId}`)
    //setQuantity(event)
    cartDispatch({
        type: "change_quantity",
        payload: {item: itemId, quantity: event}
    })
  }

  const getQuantity = (itemId) => {
    const currentItem = cartState.filter((product) => (product.item === itemId))
    console.log("current item q: ", currentItem.quantity)
    return currentItem.quantity
  }

  useEffect(() => {
    console.log("cart: ", cartState);
    const sum = products.reduce((acc, value) => acc + value.price, 0);
    setTotalPrice(sum);
  }, [products, cartState]);

  return (
    <>
      {products.map((item) => (
        <>
          <Group>
            <Image src={item.imageUrl} maw={100}/>
            <Text>{item.productId.name}</Text>
            <NumberInput label="Amount" value={0} onChange={(event) => (updateQuantity(event, item._id))} />
              <NumberFormatter
                prefix="$"
                value={item.price / 100}
                decimalScale={2}
              />
          </Group>
        </>
      ))}
      <div>Total price: {totalPrice}</div>
    </>
  );
};

export default CartSummary;
