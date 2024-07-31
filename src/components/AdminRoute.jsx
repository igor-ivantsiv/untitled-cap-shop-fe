import { useContext } from "react";
import { SessionContext } from "../contexts/SessionContext";
import { Navigate } from "react-router-dom";
import { Loader } from "@mantine/core";

const AdminRoute = ({ children }) => {
  const { isAdmin, isLoading } = useContext(SessionContext);

  if (isLoading) {
    return <Loader size={"xl"} type="dots" />;
  }

  if (!isAdmin) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AdminRoute;
