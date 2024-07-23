import {
  Button,
  Center,
  Flex,
  Group,
  Image,
  NumberFormatter,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import VariantsList from "../../components/VariantsList";
import DetailsSkeleton from "../../components/DetailsSkeleton";
import { CartContext } from "../../contexts/CartContext";

const ProductDetailsPage = () => {
  const { variantId } = useParams();

  const { cartDispatch } = useContext(CartContext);

  const [product, setProduct] = useState({});
  const [variants, setVariants] = useState([]);

  const [pageLoading, setPageLoading] = useState(true);

  // fetch current product variant
  useEffect(() => {
    const fetchProduct = async () => {
      console.log("fetching product...");
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products/variants/${variantId}`
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
  }, [variantId]);

  // fetch other variants of current product
  useEffect(() => {
    const fetchVariants = async () => {
      console.log("fetching variants..");
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products/${
            product.productId._id
          }`
        );

        if (!response.ok) {
          throw new Error("response not ok");
        }

        const data = await response.json();
        console.log("variants fetched: ", data);

        setVariants(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (product.productId) {
      fetchVariants();
    }
  }, [product]);

  // check if page is still loading
  useEffect(() => {
    if (product.productId && variants.length > 1) {
      setTimeout(() => {
        setPageLoading(false);
      }, 1000);
    }
  }, [product, variants]);

  const addToCart = () => {
    cartDispatch({
      type: "add_item",
      payload: { item: product._id, quantity: 1},
    });
  };

  return (
    <>
      <h1>Product details</h1>
      <Paper>
        <Flex
          justify="center"
          gap="md"
          direction={{ base: "column", sm: "row" }}
        >
          {pageLoading ? (
            <DetailsSkeleton />
          ) : (
            <>
              <Image src={product.imageUrl} maw={{ base: 400, md: 600 }} />
              <Stack>
                {product.productId && (
                  <>
                    <Text>{product.productId.name}</Text>
                    <Text>{product.productId.description}</Text>
                    <Text>{product.size}</Text>
                    <Text>{product.productId.material}</Text>
                  </>
                )}
                <NumberFormatter
                  prefix="$"
                  value={product.price / 100}
                  decimalScale={2}
                />
                <Center>
                  {variants && <VariantsList variants={variants} />}
                </Center>
              </Stack>
            </>
          )}
        </Flex>
      </Paper>
      <Group justify="center">
        <Button component={Link} to={"/products"}>
          Back
        </Button>
        <Button onClick={addToCart}>Add to cart</Button>
      </Group>
    </>
  );
};

export default ProductDetailsPage;
