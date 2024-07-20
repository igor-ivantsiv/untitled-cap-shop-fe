import { Button, PasswordInput, TextInput } from "@mantine/core";
import { hasLength, isEmail, matchesField, useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const navigate = useNavigate();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },

    validate: {
      email: isEmail("Invalid email"),
      username: hasLength({ min: 3 }, "Username must be at least 3 characters"),
      password: hasLength({ min: 6 }, "Password must be at least 6 characters"),
      confirmPassword: matchesField("password", "Password confirmation failed"),
    },
  });

  const handleSubmit = async (values) => {
    console.log("Form: ", values);
    const {username, email, password} = values;
    const payload = { username, email, password };
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.status !== 201) {
        throw new Error("Something went wrong");
      }

      const data = await response.json();
      console.log(data);

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form autoComplete="off" onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Username"
          {...form.getInputProps("username")}
          key={form.key("username")}
        />
        <TextInput
          label="Email"
          {...form.getInputProps("email")}
          key={form.key("email")}
        />
        <PasswordInput
          label="Password"
          {...form.getInputProps("password")}
          key={form.key("password")}
        />
        <PasswordInput
          label="Confirm password"
          {...form.getInputProps("confirmPassword")}
          key={form.key("confirmPassword")}
        />
        <Button type="submit">Register</Button>
      </form>
    </>
  );
};

export default RegisterForm;
