import {
  Button,
  Group,
  NumberFormatter,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import {
  IconArrowBack,
  IconArrowForward,
  IconCashRegister,
} from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRefetchContext } from "../../contexts/RefetchContext";
import { CartContext } from "../../contexts/CartContext";
import { SessionContext } from "../../contexts/SessionContext";
import CartItem from "../../components/CartItem";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentDetails from "../../components/PaymentDetails";

const stripePromise = loadStripe(
  "pk_test_51PgOiCIwWVetEzYRbLWc0nfQhLQKKYtxdnmZKOuIaEs5t8Ew8fKnMoMeCe6WCakBPog5jWqioFwT0QCixw4OtgMi002kogRiFM"
);

const CheckoutPage = () => {
  const { cartState } = useContext(CartContext);
  const [clientSecret, setClientSecret] = useState("");
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const { fetchWithToken, currentUser } = useContext(SessionContext);
  const { shouldRefetch } = useRefetchContext();
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [shippingData, setShippingData] = useState({
    userId: currentUser,
    firstName: "",
    lastName: "",
    streetHouseNumber: "",
    city: "",
    zipCode: "",
    items: [],
  });

  const navigate = useNavigate();

  const handleInput = (event) => {
    const { name, value } = event.currentTarget;

    setShippingData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowPaymentForm(true);
  };

  const declarePurchaseIntent = async () => {
    try {
      const purchaseIntent = await fetchWithToken(
        "/payments/create-payment-intent",
        "POST",
        { items: cartState }
      );
      setClientSecret(purchaseIntent.clientSecret);
    } catch (error) {
      console.log(error);
    }
  };

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  useEffect(() => {
    declarePurchaseIntent();
  }, []);

  useEffect(() => {
    declarePurchaseIntent();
    const fetchPrice = async (variantId, quantity) => {
      try {
        const data = await fetchWithToken(`/products/variants/${variantId}`);

        if (!data) {
          throw new Error("error fetching products in cart summary");
        }

        const itemTotal = quantity * data.price;
        setTotalPrice((prevState) => prevState + itemTotal);
      } catch (error) {
        console.error(error);
      }
    };
    // first set total price to 0
    // calc total price by fetching price for each item in cart
    setTotalPrice(0);
    if (cartState.length > 0) {
      cartState.forEach((element) => {
        fetchPrice(element.item, element.quantity);
      });
    }
    // update every time cart changes
  }, [cartState]);

  // fetch products in cart
  useEffect(() => {
    const fetchProduct = async (variantId, quantity) => {
      try {
        const data = await fetchWithToken(`/products/variants/${variantId}`);

        if (!data) {
          throw new Error("error fetching products in cart summary");
        }

        // create new object with quantity prop
        const shoppingData = { ...data, quantity };

        // add to list of products
        setProducts((prevState) => [...prevState, shoppingData]);
      } catch (error) {
        console.error(error);
      }
    };
    setProducts([]);
    cartState.forEach((product) => {
      fetchProduct(product.item, product.quantity);
    });

    // refetch on delete of item
  }, [shouldRefetch]);

  return (
    <>
      <h1>Checkout</h1>
      <div style={{ display: "flex" }}>
        <div style={{ width: "75%" }}>
          {!showPaymentForm ? (
            <>
              <h2>Shipping details</h2>
              <form onSubmit={handleSubmit}>
                <TextInput
                  name="firstName"
                  label="First Name"
                  value={shippingData.firstName}
                  onChange={handleInput}
                  required
                />
                <TextInput
                  name="lastName"
                  label="Last Name"
                  value={shippingData.lastName}
                  onChange={handleInput}
                  required
                />
                <TextInput
                  name="streetHouseNumber"
                  label="Street and house number"
                  value={shippingData.streetHouseNumber}
                  onChange={handleInput}
                  required
                />
                <TextInput
                  name="city"
                  label="City"
                  value={shippingData.city}
                  onChange={handleInput}
                  required
                />
                <TextInput
                  name="zipCode"
                  label="ZIP code"
                  value={shippingData.zipCode}
                  onChange={handleInput}
                  required
                />
                <Button
                  color="yellow"
                  size="compact-md"
                  radius="sm"
                  rightSection={<IconArrowBack size={20} />}
                  onClick={() => navigate("/")}
                >
                  Back
                </Button>
                <Button
                  color="blue"
                  size="compact-md"
                  radius="sm"
                  rightSection={<IconArrowForward size={20} />}
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPaymentForm(true);
                  }}
                >
                  Next
                </Button>
              </form>
            </>
          ) : (
            <>
              <h3>Payment details</h3>

              <div className="App">
                {clientSecret && (
                  <Elements options={options} stripe={stripePromise}>
                    <PaymentDetails setShowPaymentForm={setShowPaymentForm} shippingData={shippingData}/>
                  </Elements>
                )}
              </div>
            </>
          )}
        </div>
        <div>
          <h2>Items</h2>
          {products.map((item) => (
            <CartItem product={item} key={item._id} />
          ))}
          <Stack>
            <Group>
              <Text>Total: </Text>
              <NumberFormatter
                prefix="$"
                value={totalPrice / 100}
                decimalScale={2}
              />
            </Group>
          </Stack>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
