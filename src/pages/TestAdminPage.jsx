import { useContext, useState } from "react";
import { SessionContext } from "../contexts/SessionContext";
import { Button } from "@mantine/core";

const TestAdminPage = () => {
  const { currentUser, fetchWithToken } = useContext(SessionContext);

  const [users, setUsers] = useState([]);

  // test admin rights
  const getAllUsers = async() => {
    const data = await fetchWithToken("/users");
    console.log("fetched users: ", data);
    setUsers(data);
  }

  return (
    <>
      <h1>Admin Page</h1>
      {currentUser && (
        <>
          <h2>Current user: {currentUser}</h2>
          <Button
            onClick={getAllUsers}
          >
            Fetch users
        </Button>
        <ul>
        {users.map(user => (
            <li key={user._id}>{user.username}</li>
        ))}
        </ul>
        </>
      )}
    </>
  );
};

export default TestAdminPage;
