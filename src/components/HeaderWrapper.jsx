import { Group } from "@mantine/core";
import CartDrawer from "./CartDrawer";
import ChatBox from "../ws/ChatBox";
import classes from "../styles/HeaderWrapper.module.css";
import { useContext } from "react";
import { SessionContext } from "../contexts/SessionContext";

const HeaderWrapper = () => {
  const { isAdmin, isAuthenticated } = useContext(SessionContext);
  return (
    <Group className={classes.container} justify="flex-end" gap="sm">
      {isAuthenticated && !isAdmin && <ChatBox />}
      <CartDrawer />
    </Group>
  );
};

export default HeaderWrapper;
