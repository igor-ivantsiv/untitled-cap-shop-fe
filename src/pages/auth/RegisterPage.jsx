import RegisterForm from "../../components/RegisterForm";
import classes from "../../styles/Headers.module.css";

const RegisterPage = () => {
  return (
    <>
      <h1 className={classes.header1}>Register</h1>
      <RegisterForm />
    </>
  );
};

export default RegisterPage;
