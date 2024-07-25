import {
  Button,
  Grid,
  Group,
  Image,
  NumberFormatter,
  Text,
} from "@mantine/core";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../contexts/CartContext";
import { useRefetchContext } from "../contexts/RefetchContext";

const CartItem = ({ product }) => {
  const [buttonsLoading, setButtonsLoading] = useState(false);
  const [increaseBtnDisabled, setIncreaseBtnDisabled] = useState(false);
  const [decreaseBtnDisabled, setDecreaseBtnDisabled] = useState(false);
  const [currentQuantity, setCurrentQuantity] = useState(product.quantity);

  const { setShouldRefetch } = useRefetchContext();

  const { cartState, cartDispatch, updateVirtualStock } =
    useContext(CartContext);

  // get stock still available, disable button accordingly
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/stocks/${product._id}`
        );

        if (!response.ok) {
          throw new Error("server response not ok");
        }

        const data = await response.json();

        data.virtualStock <= 0
          ? setIncreaseBtnDisabled(true)
          : setIncreaseBtnDisabled(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStock();
  }, [buttonsLoading]);

  // disable decrease button when quantity reaches 1
  useState(() => {
    console.log("current q: ", currentQuantity);
    currentQuantity <= 1
      ? setDecreaseBtnDisabled(true)
      : setDecreaseBtnDisabled(false);
  }, [currentQuantity]);

  // decrease 1 from quantity
  // set loading state on btn, await api response
  const decreaseQuantity = async (itemId, quantity) => {
    setButtonsLoading(true);
    const response = await updateVirtualStock(
      `/stocks/dereservation/${itemId}`,
      "PUT",
      { quantity: 1 }
    );
    console.log("dereservation response: ", response);
    setTimeout(() => {
      setButtonsLoading(false);
    }, 500);

    // update cart content and current quantity of product
    if (response === "success") {
      cartDispatch({
        type: "decrease_quantity",
        payload: { id: itemId },
      });
      setCurrentQuantity(quantity - 1);

      // disable decrease btn if quantity is 1
      if (quantity - 1 === 1) {
        setDecreaseBtnDisabled(true);
      }
    } else {
      console.error("problem updating virtual stock on cart item component");
    }
  };

  // increase quantity by 1
  // set loading on btn, await api response
  const increaseQuantity = async (itemId, quantity) => {
    setButtonsLoading(true);
    const response = await updateVirtualStock(
      `/stocks/reservation/${itemId}`,
      "PUT",
      { quantity: 1 }
    );
    console.log("reservation response: ", response);
    setTimeout(() => {
      setButtonsLoading(false);
    }, 500);

    // on success -> update cart content, set current quantity, enable decrease btn
    if (response === "success" || response === "unavailable") {
      cartDispatch({
        type: "add_item",
        payload: { id: itemId, quantity: quantity + 1 },
      });
      setCurrentQuantity(quantity + 1);
      setDecreaseBtnDisabled(false);
      console.log("cart after increase: ", cartState);

      // disable increase btn if virtual stock is out
      // (!) UPDATE -> unavailable means the final item is now reserved,
      // (!) still add to cart but disable btn after
      if (response === "unavailable") {
        setIncreaseBtnDisabled(true);
      }
    } else {
      console.error("problem updating virtual stock on cart item component");
    }
  };

  // remove item + quantity from cart
  // set loading state on btns, await api response
  const removeItem = async (itemId, quantity) => {
    setButtonsLoading(true);
    const response = await updateVirtualStock(
      `/stocks/dereservation/${itemId}`,
      "PUT",
      { quantity: quantity }
    );
    console.log("dereservation response: ", response);
    setTimeout(() => {
      setButtonsLoading(false);
    }, 500);

    // on success, refetch list in cart summary
    if (response === "success") {
      cartDispatch({
        type: "remove_item",
        payload: { id: itemId },
      });
      setShouldRefetch((prevState) => !prevState);
    } else {
      console.log("problem updating virtual stock on cart item component");
    }
  };

  return (
    <Grid align="flex-start" justify="center">
      <Grid.Col span={3}>
        <Image src={product.imageUrl} />
      </Grid.Col>
      <Grid.Col span={3}>
        <Text>{product.productId.name}</Text>
      </Grid.Col>
      <Grid.Col span={3}>
        <Group>
          <Text fw={500} size="sm">
            {currentQuantity}
          </Text>
          <Button.Group orientation="vertical">
            <Button
              loading={buttonsLoading}
              disabled={increaseBtnDisabled}
              loaderProps={{ type: "dots" }}
              size="compact-xs"
              variant="outline"
              onClick={() => increaseQuantity(product._id, currentQuantity)}
            >
              <IconArrowUp />
            </Button>
            <Button
              loading={buttonsLoading}
              loaderProps={{ type: "dots" }}
              disabled={decreaseBtnDisabled}
              size="compact-xs"
              variant="outline"
              onClick={() => decreaseQuantity(product._id, currentQuantity)}
            >
              <IconArrowDown />
            </Button>
          </Button.Group>
        </Group>
      </Grid.Col>
      <Grid.Col span={2}>
        <NumberFormatter
          prefix="$"
          value={(product.price * currentQuantity) / 100}
          decimalScale={2}
        />
      </Grid.Col>
      <Grid.Col span={1}>
        <Button
          loading={buttonsLoading}
          loaderProps={{ type: "dots" }}
          size="compact-xs"
          onClick={() => removeItem(product._id, currentQuantity)}
        >
          X
        </Button>
      </Grid.Col>
    </Grid>
  );
};

export default CartItem;
