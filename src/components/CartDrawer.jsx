import { Button, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import CartSummary from "./CartSummary";
import classes from "../styles/Cart.module.css";
import { IconShoppingBag } from "@tabler/icons-react";

const CartDrawer = () => {
  const [cartOpened, cartHandler] = useDisclosure(false);
  return (
    <>
      <Drawer position="right" opened={cartOpened} onClose={cartHandler.close}>
        <h1>Shopping cart</h1>
        <CartSummary />
      </Drawer>

      <Button className={classes.button} onClick={cartHandler.open}>
        <IconShoppingBag />
      </Button>
    </>
  );
};

export default CartDrawer;
