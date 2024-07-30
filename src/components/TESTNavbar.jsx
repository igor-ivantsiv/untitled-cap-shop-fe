import { useContext } from "react";
import { Link } from "react-router-dom";
import { SessionContext } from "../contexts/SessionContext";
import { Button } from "@mantine/core";

const Navbar = () => {
  const { isAuthenticated, handleLogout, isAdmin, currentUser } =
    useContext(SessionContext);
  return (
    <>
      <Link to="/">Home</Link>
      <Link to="/products">Products</Link>
      {!isAuthenticated && (
        <>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </>
      )}
      {isAuthenticated && !isAdmin && (
        <>
          <Link to={`/profile/${currentUser}`}>Profile</Link>
          <Link to={"/checkout"}>Checkout</Link>
        </>
      )}
      {isAdmin && 
      <>
        <Link to="/admin/orders">Manage orders</Link>
        <Link to="/admin/products">Manage products</Link>
        <Link to="admin/customer-service">Customer service</Link>
      </>
      }
      {isAuthenticated && <Button onClick={handleLogout}>Log out</Button>}
    </>
  );
};

export default Navbar;
