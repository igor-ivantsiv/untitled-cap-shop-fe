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

  const { cartDispatch, updateVirtualStock } = useContext(CartContext);

  const [product, setProduct] = useState({});
  const [variants, setVariants] = useState([]);

  const [pageLoading, setPageLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [stockUnavailable, setStockUnavailable] = useState(false);

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

  useEffect(() => {
    const fetchStock = async () => {
      console.log("fetching stock...");
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/stocks/${variantId}`
        );

        if (!response.ok) {
          throw new Error("server response not ok");
        }

        const data = await response.json();
        console.log("stocks data: ", data);

        data.virtualStock <= 0
          ? setStockUnavailable(true)
          : setStockUnavailable(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStock();
  }, [variantId, buttonLoading]);

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
      setPageLoading(false);
    }
  }, [product, variants]);

  useEffect(() => {});

  const addToCart = async () => {
    setButtonLoading(true);
    const response = await updateVirtualStock(`/stocks/reservation/${product._id}`);
    console.log("reservation response: ", response);
    setTimeout(() => {
      setButtonLoading(false);
    }, 500);

    if (response === "success") {
      cartDispatch({
        type: "add_item",
        payload: { item: product._id, quantity: 1 },
      });
    } else {
      console.log("problem updating virtual stock on details page");
    }
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
        <Button
          onClick={addToCart}
          loading={buttonLoading}
          loaderProps={{ type: "dots" }}
          disabled={stockUnavailable}
        >
          {stockUnavailable ? <Text>Unavailable</Text> : <Text>Add to cart</Text>}
        </Button>
      </Group>
    </>
  );
};

export default ProductDetailsPage;
