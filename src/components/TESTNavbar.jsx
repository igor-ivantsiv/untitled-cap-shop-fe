import { useContext } from "react";
import { Link } from "react-router-dom";
import { SessionContext } from "../contexts/SessionContext";
import { Button } from "@mantine/core";
import { IconBrandRedhat, IconBuildingStore, IconCashRegister, IconHome, IconLogin2, IconMessage, IconUserPlus } from "@tabler/icons-react";
import styles from "../styles/Navbar.module.css"

const Navbar = ({ toggleBurger }) => {
  const { isAuthenticated, handleLogout, isAdmin, currentUser } =
    useContext(SessionContext);

    const logoutHandler = () => {
      handleLogout()
      toggleBurger()
    }
  return (
    <>
    <div className={styles.navbarMenu}>
      <Link className={location.pathname === "/" ? styles.active : ""} onClick={()=>toggleBurger()} to="/">
      <div className={styles.menuItem}>
      <IconHome size={30} className="navbarIcon" />
        <p className={styles.menuText} >Home</p>
      </div>
      </Link>
      <Link className={location.pathname === "/products" ? styles.active : ""} onClick={()=>toggleBurger()} to="/products">
      <div className={styles.menuItem}>
      <IconBrandRedhat size={30} className="navbarIcon" />
        <p className={styles.menuText} >Collection</p>
      </div>
      </Link>
      {!isAuthenticated && (
        <>
          <Link className={location.pathname === "/register" ? styles.active : ""} onClick={()=>toggleBurger()} to="/register">
      <div className={styles.menuItem}>
      <IconUserPlus size={30} className="navbarIcon" />
        <p className={styles.menuText} >Register</p>
      </div>
      </Link>
          <Link className={location.pathname === "/login" ? styles.active : ""} onClick={()=>toggleBurger()} to="/login">
      <div className={styles.menuItem}>
      <IconLogin2 size={30} className="navbarIcon" />
        <p className={styles.menuText} >Login</p>
      </div>
      </Link>
        </>
      )}
      {isAdmin && 
      <>
        <Link className={location.pathname === "/admin/orders" ? styles.active : ""} onClick={()=>toggleBurger()} to="/admin/orders">
      <div className={styles.menuItem}>
      <IconCashRegister size={30} className="navbarIcon" />
        <p className={styles.menuText} >Manage orders</p>
      </div>
      </Link>
        <Link className={location.pathname === "/admin/products" ? styles.active : ""} onClick={()=>toggleBurger()} to="/admin/products">
      <div className={styles.menuItem}>
      <IconBuildingStore size={30} className="navbarIcon" />
        <p className={styles.menuText} >Manage products</p>
      </div>
      </Link>
        <Link className={location.pathname === "/admin" ? styles.active : ""} onClick={()=>toggleBurger()} to="/admin">
      <div className={styles.menuItem}>
      <IconMessage size={30} className="navbarIcon" />
        <p className={styles.menuText} >Customer service</p>
      </div>
      </Link>
      </>
      }
      {isAuthenticated && <Button className={styles.logoutButton} size="compact-lg"  onClick={logoutHandler}>Log out</Button>}
      </div>
    </>
  );
};

export default Navbar;
