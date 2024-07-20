import { useContext } from "react";
import LoginForm from "../components/LoginForm";
import { SessionContext } from "../contexts/SessionContext";

const LoginPage = () => {
  // add loading state

  return (
    <>
      <h1>Login</h1>
      <LoginForm />
    </>
  );
};

export default LoginPage;
