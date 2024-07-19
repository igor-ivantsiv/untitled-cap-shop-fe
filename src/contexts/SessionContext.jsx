import { createContext, useEffect, useState } from "react";

export const SessionContext = createContext();

const SessionContextProvider = ({ children }) => {
  const [token, setToken] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState("");

  const removeToken = () => {
    window.localStorage.removeItem("authToken");
  };

  const verifyAdmin = async (tokenToVerify) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify/admin`, {
          headers: {
            Authorization: `Bearer ${tokenToVerify}`,
          },
        });
  
        if (response.status === 200) {
          setIsAdmin(true);
          const data = await response.json();
          console.log("verified admin: ", data)
          setIsLoading(false);
        }
    }
    catch(error) {
        console.log(error)
    }
  }

  const verifyToken = async (tokenToVerify) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${tokenToVerify}`,
        },
      });

      if (response.status === 200) {
        setToken(tokenToVerify);
        setIsAuthenticated(true);
        const data = await response.json();
        console.log("verified token: ", data)
        verifyAdmin(tokenToVerify);
      } else {
        setIsLoading(false);
        removeToken();
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      removeToken();
    }
  };

  useEffect(() => {
    const localToken = window.localStorage.getItem("authToken");
    if (localToken) {
      verifyToken(localToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      window.localStorage.setItem("authToken", token);
      setIsAuthenticated(true);
    }
  }, [token]);

  const fetchWithToken = async (endpoint, method = "GET", payload) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api${endpoint}`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    removeToken();
    setToken();
    setIsAuthenticated(false);
    setCurrentUser("");
  };

  return (
    <SessionContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        token,
        setToken,
        fetchWithToken,
        handleLogout,
        setCurrentUser,
        currentUser,
        isAdmin
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export default SessionContextProvider
