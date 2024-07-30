import { useContext } from "react";
import ChatBox from "../ws/ChatBox";
import ChatBoxWrapper from "../ws/ChatBoxWrapper";
import { SessionContext } from "../contexts/SessionContext";

const Homepage = () => {
  const { isAdmin, currentUser, isAuthenticated } = useContext(SessionContext);

  
  return (
    <>
      <h1>Homepage</h1>
      <h3>Logged in as {currentUser}</h3>

    {isAuthenticated && !isAdmin && 
      <ChatBox />
    }
      
    </>
  );
};

export default Homepage;
