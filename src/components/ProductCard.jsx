import { Card, Group, Image, NumberFormatter, Text } from "@mantine/core";
import { Link } from "react-router-dom";

const ProductCard = ({ image, name, price, productId }) => {
  // temporary placeholder
  /*
  const placeholderImg =
    "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg";

  const imgUrl = image ? image : placeholderImg;
*/
  return (
    <>
    <Link to={`/products/${productId}`}>
    
      <Card>
        <Card.Section>
          <Image
            src={image}
            alt=""
            fallbackSrc="https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg"
          />
        </Card.Section>
        <Group>
          <Text>{name}</Text>
          <NumberFormatter prefix="$" value={price / 100} decimalScale={2} />
        </Group>
      </Card>
      </Link>
    </>
  );
};

export default ProductCard;
