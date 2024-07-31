import {
  Button,
  Center,
  ColorSwatch,
  Divider,
  Flex,
  Group,
  Image,
  NumberFormatter,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import VariantsList from "../../components/VariantsList";
import DetailsSkeleton from "../../components/DetailsSkeleton";
import { SessionContext } from "../../contexts/SessionContext";
import { notifications } from "@mantine/notifications";
import useCartHelpers from "../../components/cart/cartHelpers";

import DetailsAccordion from "../../components/DetailsAccordion";
import DetailsColor from "../../components/DetailsColor";
import { IconArrowBack, IconShoppingCart } from "@tabler/icons-react";

const ProductDetailsPage = () => {
  const { variantId } = useParams();

  const { isAuthenticated, currentUser } = useContext(SessionContext);

  const [product, setProduct] = useState({});
  const [variants, setVariants] = useState([]);

  const [pageLoading, setPageLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [stockUnavailable, setStockUnavailable] = useState(false);

  const navigate = useNavigate();

  // fetch current product variant
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products/variants/${variantId}`
        );

        if (!response.ok) {
          throw new Error("server response not ok");
        }

        const data = await response.json();
        console.log("CURRENT PRODUCT: ", data);

        setProduct(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProduct();
  }, [variantId]);

  // get the virtual stock for current item
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/stocks/${variantId}`
        );

        if (!response.ok) {
          throw new Error("server response not ok");
        }

        const data = await response.json();

        data.virtualStock <= 0
          ? setStockUnavailable(true)
          : setStockUnavailable(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStock();
  }, [variantId, buttonLoading /*cartState*/]);

  // fetch other variants of current product
  useEffect(() => {
    const fetchVariants = async () => {
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
    if (product.productId && variants.length > 0) {
      setPageLoading(false);
    }
  }, [product, variants]);

  const { addItem } = useCartHelpers();

  const addToCart = async () => {
    if (!isAuthenticated) {
      notifications.show({
        title: "Hold up!",
        message: "Please login or register to continue shopping!",
      });
      return navigate("/login");
    }

    setButtonLoading(true);
    const success = await addItem(currentUser, product._id);
    if (success === 1) {
      notifications.show({
        title: "Success",
        message: "Product added to cart",
      });
    } else if (success === -1) {
      notifications.show({
        title: "Temporarily out of stock",
        message: "We will resupply this item as soon as possible",
      });
    } else {
      notifications.show({
        title: "Something went wrong",
        message: "We apologize. Please try again later",
      });
    }
    setTimeout(() => {
      setButtonLoading(false);
    }, 500);
  };

  return (
    <>
      {product.productId && (
        <Title order={1}>{product.productId.category}</Title>
      )}

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
              <Image src={product.imageUrl} maw={{ base: 400, md: 500 }} />
              <Stack>
                {product.productId && (
                  <>
                    <Title order={2}>{product.productId.name}</Title>

                    <Text fs={"italic"}>{product.productId.description}</Text>
                    <Group>
                      <Text span fw={500}>
                        Size:
                      </Text>
                      <Text>{product.size}</Text>
                    </Group>
                    <Group>
                      <Text span fw={500}>
                        Material:
                      </Text>
                      <Text>{product.productId.material}</Text>
                      <DetailsColor color={product.color} />
                    </Group>
                  </>
                )}

                <NumberFormatter
                  prefix="€"
                  value={product.price / 100}
                  decimalScale={2}
                />
                <Divider />
                <Text size="xs">Colors:</Text>
                <Center mb={"md"}>
                  {variants && <VariantsList variants={variants} />}
                </Center>
              </Stack>
            </>
          )}
        </Flex>
      </Paper>
      <DetailsAccordion />
      <Group justify="center">
        <Button
          component={Link}
          to={"/products"}
          rightSection={<IconArrowBack />}
        >
          <Text fw={500}>Back</Text>
        </Button>
        <Button
          rightSection={<IconShoppingCart />}
          onClick={addToCart}
          loading={buttonLoading}
          loaderProps={{ type: "dots" }}
          disabled={stockUnavailable}
        >
          {stockUnavailable ? (
            <Text fw={500}>Unavailable</Text>
          ) : (
            <Text fw={500}>Add to cart</Text>
          )}
        </Button>
      </Group>
    </>
  );
};

export default ProductDetailsPage;
