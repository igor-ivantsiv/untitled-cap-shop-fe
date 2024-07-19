import { Button, PasswordInput, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      username: "",
      password: "",
    },

    validate: {
        username: isNotEmpty("Username is required"),
        password: isNotEmpty("Password is required"),
    }
  });

  const handleSubmit = async (values) => {
    console.log("Form: ", values);
    const payload = { values };
    try {
      const response = await fetch(`http://localhost:5005/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 200 || response.status === 403) {
        const data = await response.json();
        console.log(data);
        if (response.status === 403) {
            const errorMessage = data.message;

            form.setErrors({
                username: errorMessage,
                password: errorMessage,
            });
            return;
        }

        navigate("/");
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.error(error);
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
        <PasswordInput
          label="Password"
          {...form.getInputProps("password")}
          key={form.key("password")}
        />
        <Button type="submit">Login</Button>
      </form>
    </>
  );
};

export default LoginForm;
