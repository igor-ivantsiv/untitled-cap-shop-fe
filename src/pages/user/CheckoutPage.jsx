import { Button, TextInput } from "@mantine/core";
import { IconArrowBack, IconArrowForward } from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRefetchContext } from "../../contexts/RefetchContext";
import { SessionContext } from "../../contexts/SessionContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentDetails from "../../components/PaymentDetails";
import CartOverview from "../../components/cart/CartOverview";
import { useRef } from "react";


const stripePromise = loadStripe(
  "pk_test_51PgOiCIwWVetEzYRbLWc0nfQhLQKKYtxdnmZKOuIaEs5t8Ew8fKnMoMeCe6WCakBPog5jWqioFwT0QCixw4OtgMi002kogRiFM"
);

const CheckoutPage = () => {
  const paymentIntentRef = useRef(null);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntent, setPaymentIntent] = useState("");
  const [cartPayload, setCartPayload] = useState({});
  const { fetchWithToken, currentUser } = useContext(SessionContext);
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
      // Fetch the cart data
      const fetchCart = await fetchWithToken(`/cart/${currentUser}`);
      console.log(fetchCart);

      // Update cartPayload asynchronously
      setCartPayload(fetchCart);

      // Declare the purchase intent with the fetched cart data
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
      console.log("Canceled PaymentIntent:", canceledIntent);

      return canceledIntent;
    } catch (error) {
      console.error("Error canceling PaymentIntent:", error);
      throw error;
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
                  onClick={() => {
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
        <div>
          <h2>Items</h2>
          <CartOverview />
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
