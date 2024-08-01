import { Button, Center, Divider, Drawer } from "@mantine/core";
import { IconCashRegister } from "@tabler/icons-react";
import { useContext } from "react";
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
              <h2>Your Shopping Cart</h2>
            </Center>
            <Divider m={30} />
            <CartOverview />
            {cartState.length > 0 && (
              <Center mt={20}>
                <Button
                  component={Link}
                  to={"/checkout"}
                  rightSection={<IconCashRegister />}
                  onClick={() => cartHandler.close()}
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
