import { Button, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import CartSummary from "./CartSummary";
import classes from "../styles/Cart.module.css";
import { IconShoppingBag } from "@tabler/icons-react";
import { useContext } from "react";
import { SessionContext } from "../contexts/SessionContext";
import LoginForm from "./LoginForm";
import CartOverview from "./cart/CartOverview";

const CartDrawer = () => {
  const [cartOpened, cartHandler] = useDisclosure(false);
  const { isAuthenticated } = useContext(SessionContext);
  return (
    <>
      <Drawer position="right" opened={cartOpened} onClose={cartHandler.close}>
        {isAuthenticated ? (
          <>
            <h1>Shopping cart</h1>
            <CartOverview />
          </>
        ) : (
          <LoginForm />
        )}
      </Drawer>

      <Button className={classes.button} onClick={cartHandler.open}>
        <IconShoppingBag />
      </Button>
    </>
  );
};

export default CartDrawer;
