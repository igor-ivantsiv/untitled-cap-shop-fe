import { AppShell, Burger, Button, HoverCard, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import App from "../App";
import Navbar from "./TESTNavbar";
import { Group } from "@mantine/core";
import CartDrawer from "./CartDrawer";
import ChatBox from "../ws/ChatBox";
import classes from "../styles/HeaderWrapper.module.css";
import { useContext } from "react";
import { SessionContext } from "../contexts/SessionContext";
import styles from "../styles/Navbar.module.css";
import { IconMessage, IconShoppingBag } from "@tabler/icons-react";

const AppShellComp = () => {
  const [opened, { toggle: toggleBurger }] = useDisclosure();
  const [openedChat, { toggle: toggleChat, close: closeChat }] =
    useDisclosure(false);

  const { isAdmin, isAuthenticated } = useContext(SessionContext);
  const [cartOpened, cartHandler] = useDisclosure(false);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 150,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      footer={{ height: 50 }}
      padding="md"
    >
      <AppShell.Header>
        <div className={styles.headerDiv}>
          <Burger
            opened={opened}
            onClick={toggleBurger}
            hiddenFrom="sm"
            size="sm"
          />
          <p className={styles.logo}>Untitled.</p>
          <div className={styles.headerButtonDiv}>
            {isAuthenticated && !isAdmin && (
              <HoverCard>
                <HoverCard.Target>
                  <Button size="xs" onClick={toggleChat}>
                    <IconMessage size={24} />
                  </Button>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Text size="sm" w={200}>
                    Click to open a conversation with the customer service team.
                    We will attempt to respond as soon as possible, and do our
                    best to assist you in any matter.
                  </Text>
                </HoverCard.Dropdown>
              </HoverCard>
            )}
            <Button size="xs" onClick={cartHandler.open}>
              <IconShoppingBag size={24} />
            </Button>
          </div>
        </div>

        <ChatBox
          openedChat={openedChat}
          toggleChat={toggleChat}
          closeChat={closeChat}
        />

        <CartDrawer cartOpened={cartOpened} cartHandler={cartHandler} />
      </AppShell.Header>
      <AppShell.Navbar>
        <Navbar toggleBurger={toggleBurger} />
      </AppShell.Navbar>
      <AppShell.Main>
        <App />
      </AppShell.Main>
      <AppShell.Footer>Footer</AppShell.Footer>
    </AppShell>
  );
};

export default AppShellComp;
