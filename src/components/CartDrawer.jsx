import { Button, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import classes from "../styles/Cart.module.css";
import { IconCashRegister, IconShoppingBag } from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../contexts/SessionContext";
import LoginForm from "./LoginForm";
import CartOverview from "./cart/CartOverview";
import { Link } from "react-router-dom";
import { CartContext } from "./cart/CartContext";

const CartDrawer = ({ cartOpened, cartHandler }) => {
  const { isAuthenticated } = useContext(SessionContext);
  const { cartState } = useContext(CartContext);

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
    </>
  );
};

export default CartDrawer;
