import { useContext } from "react";
import { Link } from "react-router-dom";
import { SessionContext } from "../contexts/SessionContext";
import { Button } from "@mantine/core";

const Navbar = () => {
  const { isAuthenticated, handleLogout, isAdmin } = useContext(SessionContext);
  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        {!isAuthenticated && (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        )}
        {isAuthenticated && (
          <>
            <Link to="/user">User</Link>
            <Button onClick={handleLogout}>Log out</Button>
          </>
        )}
        {isAdmin && <Link to="/admin">Admin</Link>}
        
      </nav>
    </>
  );
};

export default Navbar;
