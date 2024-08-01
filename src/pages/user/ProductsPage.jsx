import { Center, Text } from "@mantine/core";
import ProductsList from "../../components/ProductsList";
import classes from "../../styles/Headers.module.css";

const ProductsPage = () => {
  return (
    <>
      <h1 className={classes.header1}>Product Collection</h1>
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
