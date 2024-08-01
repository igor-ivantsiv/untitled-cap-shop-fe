import { Button, TextInput } from "@mantine/core";
import { IconArrowBack, IconArrowForward } from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SessionContext } from "../../contexts/SessionContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentDetails from "../../components/PaymentDetails";
import CartOverview from "../../components/cart/CartOverview";
import { useRef } from "react";
import styles from "../../styles/Checkout.module.css";

// This is a publishable key
const stripePromise = loadStripe(
  "pk_test_51PgOiCIwWVetEzYRbLWc0nfQhLQKKYtxdnmZKOuIaEs5t8Ew8fKnMoMeCe6WCakBPog5jWqioFwT0QCixw4OtgMi002kogRiFM"
);

const CheckoutPage = () => {
  //CONTEXTS
  const { fetchWithToken, currentUser } = useContext(SessionContext);

  //REFS
  const paymentIntentRef = useRef(null);

  //USESTATES
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntent, setPaymentIntent] = useState("");
  const [cartPayload, setCartPayload] = useState({});
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

  //FUNCTIONS
  const handleSubmit = (event) => {
    event.preventDefault();
    setShowPaymentForm(true);
  };

  const declarePurchaseIntent = async () => {
    try {
      const fetchCart = await fetchWithToken(`/cart/${currentUser}`);
      setCartPayload(fetchCart);
      const purchaseIntent = await fetchWithToken(
        "/payments/create-payment-intent",
        "POST",
        { cartPayload: fetchCart }
      );
      setPaymentIntent(purchaseIntent.id);
      setClientSecret(purchaseIntent.clientSecret);
      return purchaseIntent;
    } catch (error) {
      console.error("Error fetching cart or creating payment intent:", error);
    }
  };

  const cancelPurchaseIntent = async () => {
    try {
      const canceledIntent = await fetchWithToken(
        "/payments/cancel-payment-intent",
        "POST",
        { paymentIntentId: paymentIntent }
      );
      return canceledIntent;
    } catch (error) {
      console.error("Error canceling PaymentIntent:", error);
      throw error;
    }
  };

  //CONSTANTS
  const appearance = {
    theme: "stripe",
    variables: {
      colorBackground: "#2E2E2E",
      colorText: "#C9C9C9",
    },
  };
  const options = {
    clientSecret,
    appearance,
  };

//USEEFFECTS
  useEffect(() => {
    const declareIntent = async () => {
      const purchaseIntent = await declarePurchaseIntent();
      paymentIntentRef.current = purchaseIntent.id;
    };

    declareIntent();

    return () => {
      const cleanup = async () => {
        const currentPaymentIntent = paymentIntentRef.current;
        if (!currentPaymentIntent) {
          console.log("No intent to cancel");
        } else {
          const canceledIntent = await fetchWithToken(
            "/payments/cancel-payment-intent",
            "POST",
            { paymentIntentId: currentPaymentIntent }
          );
          console.log("intent canceled due to unmount");
        }
      };
      cleanup();
    };
  }, []);

  return (
    <>
      <h1>Checkout</h1>
      <div className={styles.checkoutContentDiv}>
        <div className={styles.orderOverviewDiv}>
          <h2>Order overview</h2>
          <CartOverview />
        </div>
        <div className={styles.checkoutFormDiv}>
          <div>
            {!showPaymentForm ? (
              <>
                <h2 className={styles.checkoutHeaders}>Shipping details</h2>
                <form onSubmit={handleSubmit}>
                  <TextInput
                    size="md"
                    name="firstName"
                    label="First Name"
                    value={shippingData.firstName}
                    onChange={handleInput}
                    required
                  />
                  <TextInput
                    size="md"
                    name="lastName"
                    label="Last Name"
                    value={shippingData.lastName}
                    onChange={handleInput}
                    required
                  />
                  <TextInput
                    size="md"
                    name="streetHouseNumber"
                    label="Street and house number"
                    value={shippingData.streetHouseNumber}
                    onChange={handleInput}
                    required
                  />
                  <TextInput
                    size="md"
                    name="city"
                    label="City"
                    value={shippingData.city}
                    onChange={handleInput}
                    required
                  />
                  <TextInput
                    size="md"
                    name="zipCode"
                    label="ZIP code"
                    value={shippingData.zipCode}
                    onChange={handleInput}
                    required
                  />
                  <div className={styles.checkoutButtons}>
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
                      onClick={() => {
                        setShowPaymentForm(true);
                      }}
                    >
                      Next
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2 className={styles.checkoutHeaders}>Payment details</h2>

                <div className="App">
                  {clientSecret && (
                    <Elements options={options} stripe={stripePromise}>
                      <PaymentDetails
                        setShowPaymentForm={setShowPaymentForm}
                        shippingData={shippingData}
                        declarePurchaseIntent={declarePurchaseIntent}
                        paymentIntent={paymentIntent}
                        cartPayload={cartPayload}
                        cancelPurchaseIntent={cancelPurchaseIntent}
                      />
                    </Elements>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
