import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter } from "react-router-dom";
import { RefetchProvider } from "./contexts/RefetchContext.jsx";

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./styles/global.css";
import theme from "./styles/theme.js";
import SessionContextProvider from "./contexts/SessionContext.jsx";
import AppShellComp from "./components/AppShellComp.jsx";
import CartContextProvider from "./contexts/CartContext.jsx";
import { Notifications } from "@mantine/notifications";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <MantineProvider defaultColorScheme="dark" theme={theme}>
      <SessionContextProvider>
        <RefetchProvider>
          <CartContextProvider>
            <Notifications />
            <AppShellComp />
          </CartContextProvider>
        </RefetchProvider>
      </SessionContextProvider>
    </MantineProvider>
  </BrowserRouter>
);
