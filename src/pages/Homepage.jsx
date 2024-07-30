import { useContext } from "react";
import { SessionContext } from "../contexts/SessionContext";

const Homepage = () => {
  const { currentUser, isAuthenticated } = useContext(SessionContext);

  return (
    <>
      <h1>Homepage</h1>
      <h3>Logged in as {currentUser}</h3>
    </>
  );
};

export default Homepage;
