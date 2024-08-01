import { Center, Image, Stack } from "@mantine/core";
import imageSrc from "../assets/gollum2.gif";
import classes from "../styles/Headers.module.css";

const NotFoundPage = () => {
  return (
    <Center>
      <Stack align="center" gap={"lg"}>
        <h1 className={classes.header404}>404</h1>
        <h3>No page here...</h3>

        <Image src={imageSrc} w={300} />
      </Stack>
    </Center>
  );
};

export default NotFoundPage;
