import { Button, PasswordInput, TextInput } from "@mantine/core";
import { hasLength, isEmail, matchesField, useForm } from "@mantine/form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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

  // on register -> create a new cart for user
  const createCart = async (userId) => {
    try {
      const cartResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/cart/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (cartResponse.status === 201 || cartResponse.status === 409) {
        const cartData = await cartResponse.json();

        // if user already has a cart -> log, but shouldn't be a problem
        cartResponse.status === 409
          ? console.log("CART CREATION FAILED: ", cartData.message)
          : console.log("CART CREATION SUCCES: ", cartData);
      }
    } catch (error) {
      console.error("CART CREATION FAILED: ", error);
    }
  };

  const handleSubmit = async (values) => {
    console.log("Form: ", values);
    setIsLoading(true);
    const { username, email, password } = values;
    const payload = { username, email, password };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      // check for response status
      if (response.status === 201 || response.status === 409) {
        const data = await response.json();
        console.log(data);

        // display message if username not available
        if (response.status === 409) {
          form.setErrors({ username: data.message });
          setIsLoading(false);
          return;
        }

        // create cart for user, navigate to login
        await createCart(data._id);
        setIsLoading(false);
        notifications.show({
          title: "Welcome!",
          message: "Please login to start shopping!",
        });
        navigate("/login");
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      form.setErrors({
        username: "Something went wrong, please try again",
        password: "Something went wrong, please try again",
        email: "Something went wrong, please try again",
      });
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
        <Button
          type="submit"
          loading={isLoading}
          loaderProps={{ type: "dots" }}
        >
          Register
        </Button>
      </form>
    </>
  );
};

export default RegisterForm;
