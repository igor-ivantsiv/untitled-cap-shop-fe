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
import CheckoutPage from "./pages/user/CheckoutPage";
import UserProfilePage from "./pages/user/UserProfilePage";
import ManageOrdersPage from "./pages/admin/ManageOrdersPage";
import ManageProductsPage from "./pages/admin/ManageProductsPage";
import ProductDetailsPage from "./pages/user/ProductDetailsPage";
import OrderSuccess from "./pages/user/OrderSuccess";
import WebSocketProvider from "./ws/WebSocketProvider";

function App() {
  return (
    <>
      <WebSocketProvider />
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

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
