import LoginForm from "../../components/LoginForm";
import classes from "../../styles/Headers.module.css";

const LoginPage = () => {
  return (
    <>
      <h1 className={classes.header1}>Login</h1>
      <LoginForm />
    </>
  );
};

export default LoginPage;
