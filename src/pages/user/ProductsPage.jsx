import { Center, Text, Title } from "@mantine/core";
import ProductsList from "../../components/ProductsList";

const ProductsPage = () => {
  return (
    <>
      <Title mb={30} order={1}>
        Product collection
      </Title>
      <Center>
        <Text mb={20} size="lg" fs={"italic"}>
          Browse our full collection, and find the right style and color for
          you!
        </Text>
      </Center>
      <ProductsList />
    </>
  );
};

export default ProductsPage;
