import React, { useContext, useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { IconArrowBack, IconCashRegister } from "@tabler/icons-react";
import { Button } from "@mantine/core";
import { SessionContext } from "../contexts/SessionContext";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Checkout.module.css";
import useCartHelpers from "./cart/cartHelpers";

const PaymentDetails = ({
  setShowPaymentForm,
  shippingData,
  declarePurchaseIntent,
  cartPayload,
  cancelPurchaseIntent,
}) => {
  //CONTEXTS
  const { fetchWithToken, currentUser } = useContext(SessionContext);
  const { emptyCartAfterSale } = useCartHelpers();

  //STRIPE
  const stripe = useStripe();
  const elements = useElements();

  //USESTATES
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      handleError(submitError);
      return;
    }

    try {
      // Cancel the old PaymentIntent and declare a new one
      await cancelPurchaseIntent();

      setMessage(null);

      const { content } = cartPayload;
      const newCart = content.map((item) => ({
        variantId: item.variantId._id,
        productId: item.variantId.productId,
        salesPrice: item.variantId.price,
        quantity: item.quantity,
      }));

      // Declare a new purchase intent and get the updated payment intent
      const purchaseIntent = await declarePurchaseIntent();

      if (!purchaseIntent || !purchaseIntent.id) {
        throw new Error("Failed to declare new PaymentIntent.");
      }
      const newlyDeclaredPaymentIntent = purchaseIntent.id;
      const newlyDeclaredClientSecret = purchaseIntent.clientSecret;

      // Create a new order
      const newOrder = await fetchWithToken("/orders", "POST", {
        userId: shippingData.userId,
        firstName: shippingData.firstName,
        lastName: shippingData.lastName,
        streetHouseNumber: shippingData.streetHouseNumber,
        city: shippingData.city,
        zipCode: shippingData.zipCode,
        items: newCart,
        paymentIntent: newlyDeclaredPaymentIntent, // Ensure this is updated correctly
      });
      // cleanup cart
      const cartCleanup = await emptyCartAfterSale(currentUser);
      console.log(cartCleanup);
      // Confirm the payment with Stripe
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${import.meta.env.VITE_REDIRECT_URL}`,
        },
        clientSecret: newlyDeclaredClientSecret,
      });

      // Handle errors from Stripe
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
      console.error("Error in payment processing:", error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
      navigate("/checkout/success");
    }
  };

  //CONSTANTS
  const paymentElementOptions = {
    layout: "tabs",
  };

  //USEEFFECTS
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

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement
        id="payment-element"
        options={paymentElementOptions}
        className={styles.paymentElement}
      />
      <div className={styles.checkoutButtons}>
        <Button
          color="yellow"
          size="compact-md"
          radius="sm"
          rightSection={<IconArrowBack size={20} />}
          onClick={() => setShowPaymentForm(false)}
        >
          Back
        </Button>
        <Button
          disabled={isLoading || !stripe || !elements}
          type="submit"
          color="blue"
          size="compact-md"
          radius="sm"
          rightSection={<IconCashRegister size={20} />}
        >
          <span id="button-text">
            {isLoading ? (
              <div className="spinner" id="spinner"></div>
            ) : (
              "Pay now"
            )}
          </span>
        </Button>
      </div>
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
};

export default PaymentDetails;
