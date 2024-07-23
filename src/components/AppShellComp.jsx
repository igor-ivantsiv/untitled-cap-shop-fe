import { AppShell, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import App from "../App";
import Navbar from "./TESTNavbar";
import CartDrawer from "./CartDrawer";

const AppShellComp = () => {
  const [opened, { toggle }] = useDisclosure();

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
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <CartDrawer />
      </AppShell.Header>
      <AppShell.Navbar>
        Navbar
        <Navbar />
      </AppShell.Navbar>
      <AppShell.Main>
        <App />
      </AppShell.Main>
      <AppShell.Footer>Footer</AppShell.Footer>
    </AppShell>
  );
};

export default AppShellComp;
