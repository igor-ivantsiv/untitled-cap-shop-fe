import { AspectRatio, Card, Group, Image, NumberFormatter, Text } from "@mantine/core";
import { Link } from "react-router-dom";

const ProductCard = ({ image, name, price, productId }) => {
  /* temporary placeholder

    "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg";
*/
  return (
    <>
      <Card p={"lg"} component={Link} to={`/products/${productId}`}>
        <Card.Section>
          <AspectRatio ratio={232 / 155}>
          <Image
            src={image}
            alt={name}
            fallbackSrc="https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg"
          />
          </AspectRatio>
        </Card.Section>
        <Group justify="center" gap={"lg"}>
          <Text fw={500}>{name}</Text>
          <NumberFormatter prefix="€" value={price / 100} decimalScale={2} />
        </Group>
      </Card>
    </>
  );
};

export default ProductCard;
