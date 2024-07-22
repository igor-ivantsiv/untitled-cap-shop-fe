import { Flex, Image, Paper, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductDetailsPage = () => {
  const { productId } = useParams();

  const [product, setProduct] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      console.log("fetching product...");
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products/varients/${productId}`
        );

        if (!response.ok) {
          throw new Error("server response not ok");
        }

        const data = await response.json();
        console.log("product data: ", data);

        setProduct(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProduct();
  }, [productId]);
  return (
    <>
        <h1>Product details</h1>
      <Paper>
        <Flex
          justify="center"
          gap="md"
          direction={{ base: "column", sm: "row" }}
        >
          <Image src={product.imageUrl} />
          <Stack>
            <Text>{product.productId.name}</Text>
            <Text>{product.productId.description}</Text>
            <Text>{product.productId.size}</Text>
            <Text>{product.productId.material}</Text>
          </Stack>
        </Flex>
      </Paper>
    </>
  );
};

export default ProductDetailsPage