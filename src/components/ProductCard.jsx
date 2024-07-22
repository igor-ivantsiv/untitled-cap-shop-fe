import { Card, Group, Image, NumberFormatter, Text } from "@mantine/core";

const ProductCard = ({ image, name, price }) => {

    // temporary placeholder
  const placeholderImg =
    "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg";

  const imgUrl = image ? image : placeholderImg;

  return (
    <>
      <Card>
        <Card.Section>
          <Image src={imgUrl} alt="" />
        </Card.Section>
        <Group>
          <Text>{name}</Text>
          <NumberFormatter prefix="$" value={price / 100} decimalScale={2} />
        </Group>
      </Card>
    </>
  );
};

export default ProductCard;
