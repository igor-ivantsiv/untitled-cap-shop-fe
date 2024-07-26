import React, { useContext, useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { IconArrowBack, IconCashRegister } from "@tabler/icons-react";
import { Button } from "@mantine/core";
import { SessionContext } from "../contexts/SessionContext";
import { CartContext } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";


const PaymentDetails = ({ setShowPaymentForm, shippingData }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { fetchWithToken } = useContext(SessionContext);
  const { cartState } = useContext(CartContext);
const navigate = useNavigate()
  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: "http://localhost:5173/checkout/success",
        
        
      },
      redirect: "if_required"
    });
    try {
        const newOrder = await fetchWithToken("/orders", "POST", {
          userId: shippingData.currentUser,
          firstName: shippingData.firstName,
          lastName: shippingData.lastName,
          streetHouseNumber: shippingData.streetHouseNumber,
          city: shippingData.city,
          zipCode: shippingData.zipCode,
          items: cartState,
        });
        console.log(newOrder);

      } catch (error) {
        console.log(error);
      }
    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }
    setIsLoading(false);
    navigate("/checkout/success")

  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <Button
        disabled={isLoading || !stripe || !elements}
        type="submit"
        color="blue"
        size="compact-md"
        radius="sm"
        rightSection={<IconCashRegister size={20} />}
      >
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </Button>
      <button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      <Button
        color="yellow"
        size="compact-md"
        radius="sm"
        rightSection={<IconArrowBack size={20} />}
        onClick={() => setShowPaymentForm(false)}
      >
        Back
      </Button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
};

export default PaymentDetails;
