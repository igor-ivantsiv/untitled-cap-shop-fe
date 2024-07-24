import {
  Button,
  Grid,
  Group,
  Image,
  NumberFormatter,
  Text,
} from "@mantine/core";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";
import { useContext, useState } from "react";
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

  useState(() => {
    currentQuantity <= 1
      ? setDecreaseBtnDisabled(true)
      : setDecreaseBtnDisabled(false);
  }, [currentQuantity]);

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

    if (response === "success") {
      cartDispatch({
        type: "change_quantity",
        payload: { item: itemId, quantity: quantity - 1 },
      });
      setCurrentQuantity(quantity - 1);
      if (quantity - 1 === 1) {
        setDecreaseBtnDisabled(true);
      }
    } else {
      console.log("problem updating virtual stock on cart summary page");
    }
  };

  const increaseQuantity = async (itemId, quantity) => {
    setButtonsLoading(true);
    const response = await updateVirtualStock(`/stocks/reservation/${itemId}`);
    console.log("reservation response: ", response);
    setTimeout(() => {
      setButtonsLoading(false);
    }, 500);

    if (response === "success") {
      cartDispatch({
        type: "add_item",
        payload: { item: itemId, quantity: quantity + 1 },
      });
      setCurrentQuantity(quantity + 1);
      setDecreaseBtnDisabled(false);
      console.log("cart after increase: ", cartState);
    } else if (response === "unavailable") {
      setIncreaseBtnDisabled(true);
    } else {
      console.log("problem updating virtual stock on details page");
    }
  };

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

    if (response === "success") {
      cartDispatch({
        type: "remove_item",
        payload: itemId,
      });
      setShouldRefetch((prevState) => !prevState);
    } else {
      console.log("problem updating virtual stock on cart summary page");
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
