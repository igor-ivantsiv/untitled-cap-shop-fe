import { Title } from "@mantine/core";
import RegisterForm from "../../components/RegisterForm";

const RegisterPage = () => {
  return (
    <>
      <Title order={1} mb={30}>
        Register
      </Title>
      <RegisterForm />
    </>
  );
};

export default RegisterPage;
