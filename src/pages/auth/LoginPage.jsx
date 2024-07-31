import { Title } from "@mantine/core";
import LoginForm from "../../components/LoginForm";

const LoginPage = () => {
  return (
    <>
      <Title order={1} mb={30}>
        Login
      </Title>
      <LoginForm />
    </>
  );
};

export default LoginPage;
