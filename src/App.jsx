import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import PrivateRoute from "./components/PrivateRoute";
import TestProfile from "./pages/TestProfile";
import AdminRoute from "./components/AdminRoute";
import TestAdminPage from "./pages/TestAdminPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProductsPage from "./pages/user/ProductsPage";

import UserProfilePage from "./pages/user/UserProfilePage";
import ManageOrdersPage from "./pages/admin/ManageOrdersPage";
import ManageProductsPage from "./pages/admin/ManageProductsPage";
import ProductDetailsPage from "./pages/user/ProductDetailsPage";
import OrderSuccess from "./pages/user/OrderSuccess";
import WebSocketProvider from "./ws/WebSocketProvider";
import { useContext, useEffect, useRef, useState } from "react";
import { SessionContext } from "./contexts/SessionContext";
import { notifications } from "@mantine/notifications";
import CheckoutPage from "./pages/user/CheckoutPage";
import CustomerServicePage from "./pages/admin/CustomerServicePage";
import AboutPage from "./pages/AboutPage";

function App() {
  const { handleLogout, currentUser } = useContext(SessionContext);
  const idleTimeoutRef = useRef(null);
  const isLoggedOutRef = useRef(false);

  useEffect(() => {
    // if app is not visible for 1h -> logout user to empty cart and free up items
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // clear timeout id
        clearTimeout(idleTimeoutRef.current);

        // notify user if they were logged in before
        if (isLoggedOutRef.current) {
          notifications.show({
            title: "Oh no!",
            message: "You were logged out due to inactivity",
          });

          // set logged out ref back to false
          isLoggedOutRef.current = false;
        }
      } else {
        // set timeout, save id in reference
        idleTimeoutRef.current = setTimeout(() => {
          // if there was a user, set ref to true -> to display message when returning to page
          if (currentUser) {
            isLoggedOutRef.current = true;
            // logout user to clear cart and free up items
            handleLogout();
          }
        }, 60 * 60 * 1000);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [currentUser]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />

        {/* auth routes */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* store/user routes */}
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:variantId" element={<ProductDetailsPage />} />
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <CheckoutPage />
            </PrivateRoute>
          }
        />
        <Route
          path="profile/:userId"
          element={
            <PrivateRoute>
              <UserProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/checkout/success"
          element={
            <PrivateRoute>
              <OrderSuccess />
            </PrivateRoute>
          }
        />

        {/* admin routes */}
        <Route
          path="admin/orders"
          element={
            <AdminRoute>
              <ManageOrdersPage />
            </AdminRoute>
          }
        />
        <Route
          path="admin/products"
          element={
            <AdminRoute>
              <ManageProductsPage />
            </AdminRoute>
          }
        />
        <Route
          path="admin/customer-service"
          element={
            <AdminRoute>
              <CustomerServicePage />
            </AdminRoute>
          }
        />

        {/* TEST ROUTES */}
        <Route
          path="/users/:userId"
          element={
            <PrivateRoute>
              <TestProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <TestAdminPage />
            </AdminRoute>
          }
        />
        <Route path="/about" element={<AboutPage/> } />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
