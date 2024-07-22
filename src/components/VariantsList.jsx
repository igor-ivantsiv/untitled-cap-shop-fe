import { AspectRatio, Flex, Image, Paper, ScrollArea } from "@mantine/core";
import { Link } from "react-router-dom";

const VariantsList = ({ variants }) => {
  return (
    <>
      <ScrollArea w={{ base: 300, md: 800 }} type="auto">
        <Flex direction="row" gap="sm">
          {variants.map((variant) => (
            <Paper
              w={100}
              withBorder
              component={Link}
              to={`/products/${variant._id}`}
              key={variant._id}
            >
              <AspectRatio ratio={1 / 1}>
                <Image src={variant.imageUrl} />
              </AspectRatio>
            </Paper>
          ))}
        </Flex>
      </ScrollArea>
    </>
  );
};

export default VariantsList;
