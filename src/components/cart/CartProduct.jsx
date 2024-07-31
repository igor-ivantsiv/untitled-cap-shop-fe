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
import useCartHelpers from "./cartHelpers";
import { SessionContext } from "../../contexts/SessionContext";
import { notifications } from "@mantine/notifications";

const CartProduct = ({ product, onDelete, onQuantityChange }) => {
  const [currentQuantity, setCurrentQuantity] = useState(product.quantity);
  const [buttonsLoading, setButtonsLoading] = useState(false);
  const [increaseBtnDisabled, setIncreaseBtnDisabled] = useState(false);
  const [decreaseBtnDisabled, setDecreaseBtnDisabled] = useState(false);

  const { fetchWithToken, currentUser } = useContext(SessionContext);

  const { addItem, decreaseItem, removeItem } = useCartHelpers();

  // check stock still available, disable btns accordingly
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const data = await fetchWithToken(`/stocks/${product.variantId._id}`);

        if (!data) {
          throw new Error("server response not ok");
        }

        data.virtualStock <= 0
          ? setIncreaseBtnDisabled(true)
          : setIncreaseBtnDisabled(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStock();
  }, [buttonsLoading]);

  // check quantity of item, ensure it doesn't go below 1
  useEffect(() => {
    currentQuantity <= 1
      ? setDecreaseBtnDisabled(true)
      : setDecreaseBtnDisabled(false);
  }, [buttonsLoading]);

  // add 1 to an item in cart
  const increaseQuantity = async () => {
    setButtonsLoading(true);
    const success = await addItem(currentUser, product.variantId._id);

    if (success === 0) {
      notifications.show({
        title: "Something went wrong",
        message: "We apologize. Please try again later",
      });
    } else if (success === -1) {
      notifications.show({
        title: "Temporarily out of stock",
        message: "We will resupply this item as soon as possible",
      });
      setIncreaseBtnDisabled(true);
    } else {
      // call function to update total price in parent component
      onQuantityChange(product._id, currentQuantity + 1);

      // update displayed quantity in current component
      setCurrentQuantity((prevState) => prevState + 1);
    }
    setTimeout(() => {
      setButtonsLoading(false);
    }, 500);
  };

  // decrease item in cart by 1
  const decreaseQuantity = async () => {
    if (currentQuantity <= 1) {
      setDecreaseBtnDisabled(true);
      return;
    }
    setButtonsLoading(true);
    const success = await decreaseItem(currentUser, product.variantId._id);
    if (success === 0) {
      notifications.show({
        title: "Something went wrong",
        message: "We apologize. Please try again later",
      });
    } else {
      // call function to update total price in parent component
      onQuantityChange(product._id, currentQuantity - 1);

      // update current quantity in this component
      setCurrentQuantity((prevState) => prevState - 1);
    }

    setTimeout(() => {
      setButtonsLoading(false);
    }, 500);
  };

  const removeFromCart = async () => {
    setButtonsLoading(true);

    // will return 1 if removal from cart was success
    const success = await removeItem(
      currentUser,
      product.variantId._id,
      currentQuantity
    );

    // notify user
    success
      ? notifications.show({
          title: "Product removed",
        })
      : notifications.show({
          title: "Something went wrong",
          message: "We apologize. Please try again later",
        });

    // call function to remove item from list in parent component
    onDelete(product._id);
    setTimeout(() => {
      setButtonsLoading(false);
    }, 500);
  };

  return (
    <Grid align="center" justify="center" mb={10}>
      <Grid.Col span={3}>
        <Image src={product.variantId.imageUrl} />
      </Grid.Col>
      <Grid.Col span={3}>
        <Text>{product.variantId.category}</Text>
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
              onClick={increaseQuantity}
            >
              <IconArrowUp />
            </Button>
            <Button
              loading={buttonsLoading}
              loaderProps={{ type: "dots" }}
              disabled={decreaseBtnDisabled}
              size="compact-xs"
              variant="outline"
              onClick={decreaseQuantity}
            >
              <IconArrowDown />
            </Button>
          </Button.Group>
        </Group>
      </Grid.Col>
      <Grid.Col span={2}>
        <NumberFormatter
          prefix="€"
          value={(product.variantId.price * currentQuantity) / 100}
          decimalScale={2}
        />
      </Grid.Col>
      <Grid.Col span={1}>
        <Button
          loading={buttonsLoading}
          loaderProps={{ type: "dots" }}
          size="compact-xs"
          onClick={removeFromCart}
        >
          X
        </Button>
      </Grid.Col>
    </Grid>
  );
};

export default CartProduct;
