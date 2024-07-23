import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter } from "react-router-dom";

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import "./styles/global.css";
import theme from "./styles/theme.js";
import SessionContextProvider from "./contexts/SessionContext.jsx";
import AppShellComp from "./components/AppShellComp.jsx";
import CartContextProvider from "./contexts/CartContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <MantineProvider defaultColorScheme="dark" theme={theme}>
        <SessionContextProvider>
          <CartContextProvider>
            <AppShellComp />
          </CartContextProvider>
        </SessionContextProvider>
      </MantineProvider>
    </BrowserRouter>
  </React.StrictMode>
);
