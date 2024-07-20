import { useContext } from "react";
import { Link } from "react-router-dom";
import { SessionContext } from "../contexts/SessionContext";
import { Button } from "@mantine/core";

const Navbar = () => {
  const { isAuthenticated, handleLogout, isAdmin, currentUser } = useContext(SessionContext);
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
        {(isAuthenticated && !isAdmin) && (
          <>
            <Link to={`users/${currentUser}`}>User</Link>
          </>
        )}
        {isAdmin && <Link to="/admin">Admin</Link>}
        {isAuthenticated && <Button onClick={handleLogout}>Log out</Button>}
        
      </nav>
    </>
  );
};

export default Navbar;
