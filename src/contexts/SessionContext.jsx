import { createContext, useEffect, useState } from "react";

export const SessionContext = createContext();

const SessionContextProvider = ({ children }) => {
  const [token, setToken] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState("");

  // remove token from local storage
  const removeToken = () => {
    window.localStorage.removeItem("authToken");
  };

  // (!)route to verify admin, might not be necessary
  const verifyAdmin = async (tokenToVerify) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/verify/admin`,
        {
          headers: {
            Authorization: `Bearer ${tokenToVerify}`,
          },
        }
      );

      if (response.status === 200) {
        setIsAdmin(true);
        const data = await response.json();
        console.log("verified admin: ", data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // verify token on backend
  const verifyToken = async (tokenToVerify) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/verify`,
        {
          headers: {
            Authorization: `Bearer ${tokenToVerify}`,
          },
        }
      );

      // if response ok -> set token and authenticate
      // get username and role of current user
      // turn off loading state
      if (response.status === 200) {
        setToken(tokenToVerify);
        setIsAuthenticated(true);
        const data = await response.json();
        //console.log("verified token: ", data);
        setCurrentUser(data.userId);
        if (data.role === "admin") {
          setIsAdmin(true);
        }
        setIsLoading(false);

        // if token is not verified -> remove token, turn off loading state
      } else {
        setIsLoading(false);
        removeToken();
      }

      // in case of error -> remove token, turn off loading state
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      removeToken();
    }
  };

  // check local storage for token, verify token
  useEffect(() => {
    const localToken = window.localStorage.getItem("authToken");
    if (localToken) {
      verifyToken(localToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  // if token created (on login) -> save token in local storage
  // verify to get name and role
  useEffect(() => {
    if (token) {
      window.localStorage.setItem("authToken", token);
      verifyToken(token);
    }
  }, [token]);

  // make requests with token
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
    setIsAdmin(false);
    sessionStorage.removeItem("cartContent")
  };

  return (
    <SessionContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        setToken,
        token,
        fetchWithToken,
        handleLogout,
        currentUser,
        isAdmin,
        setIsLoading,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export default SessionContextProvider;
