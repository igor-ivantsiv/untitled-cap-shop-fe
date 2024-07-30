import { Button, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import CartSummary from "./CartSummary";
import classes from "../styles/Cart.module.css";
import { IconCashRegister, IconShoppingBag } from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../contexts/SessionContext";
import LoginForm from "./LoginForm";
import CartOverview from "./cart/CartOverview";
import { Link } from "react-router-dom";
import { CartContext } from "./cart/CartContext";
import { useRefetchContext } from "../contexts/RefetchContext";

const CartDrawer = () => {
  const [cartOpened, cartHandler] = useDisclosure(false);
  const { isAuthenticated } = useContext(SessionContext);
  const [cartArray, setCartArray] = useState([]);
  const { cartState } = useContext(CartContext);
  const { shouldRefetch } = useRefetchContext();

  useEffect(() => {
    const storedCart = sessionStorage.getItem("cartContent");
    if (storedCart) {
      console.log("stored cart: ", storedCart);
      setCartArray(JSON.parse(storedCart));
    }
    console.log("cartState: ", cartState)
  }, [cartState, cartOpened]);

  return (
    <>
      <Drawer position="right" opened={cartOpened} onClose={cartHandler.close}>
        {isAuthenticated ? (
          <>
            <h1>Shopping cart</h1>
            <CartOverview />
            {cartState.length > 0 && (
              <Button
                component={Link}
                to={"/checkout"}
                rightSection={<IconCashRegister />}
              >
                Checkout
              </Button>
            )}
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
