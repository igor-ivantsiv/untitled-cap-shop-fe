import { Button, Center, Divider, Drawer, Title } from "@mantine/core";
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
            <Center>
              <Title mb={10} order={2}>
                Your shopping cart
              </Title>
            </Center>
            <Divider m={30} />
            <CartOverview />
            {cartState.length > 0 && (
              <Center mt={20}>
                <Button
                  component={Link}
                  to={"/checkout"}
                  rightSection={<IconCashRegister />}
                  onClick={() => (cartHandler.close())}
                >
                  Checkout
                </Button>
              </Center>
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
