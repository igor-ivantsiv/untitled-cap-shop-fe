import { ActionIcon, AppShell, Burger, Button, HoverCard, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import App from "../App";
import Navbar from "./TESTNavbar";
import { Group } from "@mantine/core";
import CartDrawer from "./CartDrawer";
import ChatBox from "../ws/ChatBox";
import classes from "../styles/HeaderWrapper.module.css";
import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../contexts/SessionContext";
import styles from "../styles/Navbar.module.css";
import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand, IconMessage, IconShoppingBag, IconShoppingCart } from "@tabler/icons-react";

const AppShellComp = () => {
  const [opened, { toggle: toggleBurger }] = useDisclosure();
  const [openedChat, { toggle: toggleChat, close: closeChat }] =
    useDisclosure(false);
    const [navbarSmall, setNavbarSmall] = useState(false);

  const { isAdmin, isAuthenticated } = useContext(SessionContext);
  const [cartOpened, cartHandler] = useDisclosure(false);

  const navbarWidth = navbarSmall ? 62 : 240;

  const footerPaddingLeft = navbarSmall ? "62px" : "240px";

  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    const updateNavbarState = () => {
      if (window.innerWidth < 768) {
        setNavbarSmall(false);
      }
    };

    // Initial check
    updateNavbarState();

    // Event listener for window resize
    window.addEventListener("resize", updateNavbarState);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener("resize", updateNavbarState);
    };
  }, []);


  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: navbarWidth,
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
              <IconShoppingCart size={24} />
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
      <div className="divNavbar">
      {navbarSmall ? (
            <ActionIcon
              size={32}
              variant="default"
              aria-label="ActionIcon with size as a number"
              radius="xl"
              onClick={() => setNavbarSmall(false)}
              className={`${styles.mobileHidden} ${styles.collapseIcon}`}
            >
              <IconLayoutSidebarLeftExpand />
            </ActionIcon>
          ) : (
            <ActionIcon
              size={32}
              variant="default"
              aria-label="ActionIcon with size as a number"
              radius="xl"
              onClick={() => setNavbarSmall(true)}
              className={`${styles.mobileHidden} ${styles.collapseIcon}`}
            >
              <IconLayoutSidebarLeftCollapse />
            </ActionIcon>
          )}
        <Navbar toggleBurger={toggleBurger} navbarSmall={navbarSmall} />
        </div>
      </AppShell.Navbar>
      <AppShell.Main>
        <div style ={{margin: "0px 10px"}}>
        <App />
        </div>
      </AppShell.Main>
      <AppShell.Footer>Footer</AppShell.Footer>
    </AppShell>
  );
};

export default AppShellComp;
