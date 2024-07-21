import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../contexts/SessionContext";
import { Button } from "@mantine/core";
import { Navigate, useParams } from "react-router-dom";

const TestProfile = () => {
  const { currentUser, fetchWithToken } = useContext(SessionContext);

  const { userId } = useParams();

  const [userProfile, setUserProfile] = useState({});

  if (currentUser !== userId) {
    return <Navigate to="/login" />;
  }

  // (TEST) get current user's profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await fetchWithToken(`/users/${userId}`);
        console.log("fetched: ", data);
        if (!data) {
          throw new Error("forbidden");
        }
        setUserProfile(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, [userId]);

  const [users, setUsers] = useState([]);

  // test for admin rights
  const getAllUsers = async () => {
    try {
      const data = await fetchWithToken("/users");
      console.log("fetched users: ", data);
      if (!data) {
        throw new Error("forbidden");
      }
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <h1>User Page</h1>
      {currentUser && (
        <>
          <h2>Current user: {currentUser}</h2>
          <div>
            <p>username: {userProfile.username}</p>
            <p>email: {userProfile.email}</p>
          </div>
          <Button onClick={getAllUsers}>Fetch users</Button>
          {users.length > 0 && (
            <ul>
              {users.map((user) => (
                <li key={user._id}>{user.username}</li>
              ))}
            </ul>
          )}
        </>
      )}
    </>
  );
};

export default TestProfile;
