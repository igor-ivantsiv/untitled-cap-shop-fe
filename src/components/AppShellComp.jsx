import { ActionIcon, AppShell, Burger, Button, HoverCard, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import App from "../App";
import Navbar from "./Navbar";
import CartDrawer from "./CartDrawer";
import ChatBox from "../ws/ChatBox";
import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../contexts/SessionContext";
import styles from "../styles/Navbar.module.css";
import { IconBrandGithub, IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand, IconMessage, IconShoppingCart } from "@tabler/icons-react";
import { Link } from "react-router-dom";

const AppShellComp = () => {
//CONTEXTS
  const { isAdmin, isAuthenticated } = useContext(SessionContext);

  //USESTATES
  const [opened, { toggle: toggleBurger }] = useDisclosure();
  const [openedChat, { toggle: toggleChat, close: closeChat }] =
    useDisclosure(false);
    const [navbarSmall, setNavbarSmall] = useState(false);
  const [cartOpened, cartHandler] = useDisclosure(false);

  const navbarWidth = navbarSmall ? 62 : 260;

  /*
  const footerPaddingLeft = navbarSmall ? "62px" : "240px";

  const isMobile = window.innerWidth < 768;
  */

  //USEEFFECTS
  useEffect(() => {
    const updateNavbarState = () => {
      if (window.innerWidth < 768) {
        setNavbarSmall(false);
      }
    };
    updateNavbarState();
    window.addEventListener("resize", updateNavbarState);
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
      <AppShell.Navbar className={styles.navbar}>
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
      <AppShell.Footer p="xs" className={styles.footer}>
      <footer>
      <div className={`${styles.footerContentDiv} ${styles.footerMobile}`} >
      <Text size="sm" className="footer-link">
            <a style={{color: "white",   display: "inline-flex",
                  alignItems: "center",}}  href="https://github.com/tdot123-1" target="_blank">
            <IconBrandGithub size={18} color="white" /> Thomas 
            </a>
          </Text>
          <Text size="sm" className={styles.footerLink}>
            <a style={{color: "white",   display: "inline-flex",
                  alignItems: "center",}}  href="https://github.com/igor-ivantsiv/" target="_blank">
            <IconBrandGithub size={18} color="white" /> Igor 
            </a>
          </Text>
          <a 
          
          target="_blank"
          href="https://github.com/igor-ivantsiv/untitled-cap-shop-fe"
        >
          <Text style={{color: "white",   display: "inline-flex",
                  alignItems: "center",}} size="sm" className="footer-link">
          <IconBrandGithub size={18} color="white" /> GitHub repository
          </Text>
          
        </a>
          <Link to={"/about"}>
          <Text size="sm" className="footer-link">About us</Text>
          </Link>
          <Text size="sm" className="footer-link">Made by Thomas & Igor ©</Text>

      </div>
      </footer>
      </AppShell.Footer>
    </AppShell>
  );
};

export default AppShellComp;
