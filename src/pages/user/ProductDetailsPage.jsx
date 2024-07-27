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
import { Link, useNavigate, useParams } from "react-router-dom";
import VariantsList from "../../components/VariantsList";
import DetailsSkeleton from "../../components/DetailsSkeleton";
import { CartContext } from "../../contexts/CartContext";
import { SessionContext } from "../../contexts/SessionContext";
import { notifications } from "@mantine/notifications";
import useCartHelpers from "../../components/cart/cartHelpers";

const ProductDetailsPage = () => {
  const { variantId } = useParams();

  /*
  const { cartDispatch, updateVirtualStock, cartState } =
    useContext(CartContext);
    */
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
  }, [variantId, buttonLoading, /*cartState*/]);

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
    if (product.productId && variants.length > 1) {
      setPageLoading(false);
    }
  }, [product, variants]);

  /*
  // on click -> set btn loading state, await api response
  const addToCart = async () => {
    // if not authenticated, redirect
    if (!isAuthenticated) {
      notifications.show({
        title: "Hold up!",
        message: "Please login or register to continue shopping!",
      });
      return navigate("/login");
    }
    setButtonLoading(true);
    const response = await updateVirtualStock(
      `/stocks/reservation/${product._id}`,
      "PUT",
      { quantity: 1 }
    );

    setTimeout(() => {
      setButtonLoading(false);
    }, 500);
    console.log("response on details page: ", response);
    // on success -> update cart (btn will be disabled when stock reaches 0)
    // (!) UPDATE: unavailable means last item has now been reserver ->
    // still add to cart, disable button after
    if (response === "success" || response === "unavailable") {
      cartDispatch({
        type: "add_item",
        payload: {
          id: product._id,
          quantity: 1,
          salesPrice: product.price,
          productId: product.productId._id,
        },
      });
      if (response === "unavailable") {
        setStockUnavailable(true);
      }
    } else {
      console.log("problem updating virtual stock on details page");
    }
  };
*/

  const { addItem } = useCartHelpers();

  const addToCart = async() => {
    setButtonLoading(true)
    const success = await addItem(currentUser, product._id);
    if (success === 1) {
      notifications.show({
        title: "Success",
        message: "Product added to cart",
      });
    }
    else if (success === -1) {
      notifications.show({
        title: "Temporarily out of stock",
        message: "We will resupply this item as soon as possible",
      });
    }
    else {
      notifications.show({
        title: "Something went wrong",
        message: "We apologize. Please try again later",
      });
    }
    setTimeout(() => {
      setButtonLoading(false);
    }, 500);
  }

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
          {stockUnavailable ? (
            <Text>Unavailable</Text>
          ) : (
            <Text>Add to cart</Text>
          )}
        </Button>
      </Group>
    </>
  );
};

export default ProductDetailsPage;
