import { AspectRatio, Card, Group, Image, NumberFormatter, Text } from "@mantine/core";
import { Link } from "react-router-dom";

const ProductCard = ({ image, name, price, productId }) => {

  return (
    <>
      <Card p={"lg"} component={Link} to={`/products/${productId}`}>
        <Card.Section>
          <AspectRatio ratio={232 / 155}>
          <Image
            src={image}
            alt={name}
            fallbackSrc="https://placehold.co/232x155"
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
