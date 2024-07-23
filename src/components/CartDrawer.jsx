import { Button, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import CartSummary from "./CartSummary";

const CartDrawer = () => {
  const [cartOpened, cartHandler] = useDisclosure(false);
  const { cartState } = useContext(CartContext);
  return (
    <>
      <Drawer position="right" opened={cartOpened} onClose={cartHandler.close}>
        <h1>Shopping cart</h1>
        <CartSummary />
      </Drawer>

      <Button onClick={cartHandler.open}>Open</Button>
    </>
  );
};

export default CartDrawer;
