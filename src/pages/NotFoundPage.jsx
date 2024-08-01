import { Center, Image, Stack, Title } from "@mantine/core";
import imageSrc from "../assets/gollum2.gif"

const NotFoundPage = () => {
  return (
    <Center>
      <Stack align="center" gap={"lg"}>
        <Title order={1} size={80} >404</Title>
        <Title order={3}>No page here...</Title>
        
        <Image src={imageSrc} w={300}/>
        
      </Stack>
    </Center>
  );
};

export default NotFoundPage;
