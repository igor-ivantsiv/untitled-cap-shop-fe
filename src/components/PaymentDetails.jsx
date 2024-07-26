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

const PaymentDetails = ({
  setShowPaymentForm,
  shippingData,
  declarePurchaseIntent,
  paymentIntent
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { fetchWithToken } = useContext(SessionContext);
  const { cartState } = useContext(CartContext);
  const navigate = useNavigate();

  const cancelPurchaseIntent = async (paymentIntentId) => {
    try {
      const response = await fetchWithToken(
        "/payments/cancel-payment-intent",
        "POST",
        { paymentIntentId }
      );
      
      if (!response.ok) {
        throw new Error('Failed to cancel PaymentIntent');
      }

      const canceledIntent = await response.json();
      console.log('Canceled PaymentIntent:', canceledIntent);
      return canceledIntent;
    } catch (error) {
      console.error('Error canceling PaymentIntent:', error);
      throw error;
    }
  };

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

  const renameKey = (obj, oldKey, newKey) => {
    if (!obj.hasOwnProperty(oldKey)) {
      return obj;
    }

    const newObj = { ...obj };
    newObj[newKey] = newObj[oldKey];
    delete newObj[oldKey];

    return newObj;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const modifiedCart = cartState.map((item) => {
        return renameKey(item, "id", "variantId");
      });

      // Cancel the old PaymentIntent
    

      // Declare a new purchase intent and await its result
      const prePayment = await declarePurchaseIntent();

      // Proceed with the order creation
      const newOrder = await fetchWithToken("/orders", "POST", {
        userId: shippingData.userId,
        firstName: shippingData.firstName,
        lastName: shippingData.lastName,
        streetHouseNumber: shippingData.streetHouseNumber,
        city: shippingData.city,
        zipCode: shippingData.zipCode,
        items: modifiedCart,
        paymentIntent: paymentIntent, // Correctly use the new PaymentIntent ID
      });

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: "http://localhost:5173/checkout/success",
        },
        redirect: "if_required",
        payment_intent_data: {
          metadata: {
            orderId: newOrder._id, // Use the order ID from the newly created order
          },
        },
      });

      // Handling errors
      if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
          setMessage(error.message);
        } else {
          setMessage("An unexpected error occurred.");
        }
      } else {
        setMessage("Payment processing...");
      }
      
    } catch (error) {
      console.error('Error in payment processing:', error);
      setMessage(`Error: ${error.message}`);
    }

    setIsLoading(false);
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
      <Button
        color="yellow"
        size="compact-md"
        radius="sm"
        rightSection={<IconArrowBack size={20} />}
        onClick={() => setShowPaymentForm(false)}
      >
        Back
      </Button>
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
};

export default PaymentDetails;