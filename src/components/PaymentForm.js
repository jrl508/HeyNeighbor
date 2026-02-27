import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import PropTypes from "prop-types";
import { confirmPayment } from "../api/payments";

const PaymentForm = ({
  booking,
  payment,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!stripe || !elements) {
      setError("Stripe is not loaded");
      setLoading(false);
      return;
    }

    try {
      console.log(
        `[PaymentForm] processing payment: booking_id=${booking.id} amount=${payment.payment.amount}`,
      );

      // Confirm the payment with Stripe
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(payment.clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {},
          },
        });

      if (stripeError) {
        console.error("[PaymentForm] stripe error:", stripeError.message);
        setError(stripeError.message);
        onPaymentError && onPaymentError(stripeError);
        setLoading(false);
        return;
      }

      console.log(
        `[PaymentForm] payment intent status: ${paymentIntent.status}`,
      );

      // Confirm the payment on our backend
      const res = await confirmPayment(booking.id, paymentIntent.id, token);

      if (!res.ok) {
        const errorData = await res.json();
        console.error("[PaymentForm] backend error:", errorData.message);
        setError(errorData.message || "Payment confirmation failed");
        onPaymentError && onPaymentError(errorData);
        setLoading(false);
        return;
      }

      const data = await res.json();
      console.log("[PaymentForm] payment confirmed successfully");
      onPaymentSuccess && onPaymentSuccess(data);
    } catch (err) {
      console.error("[PaymentForm] error:", err.message);
      setError(err.message);
      onPaymentError && onPaymentError(err);
    } finally {
      setLoading(false);
    }
  };

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
      },
    },
  };

  return (
    <div style={{ padding: "20px" }}>
      <div className="field">
        <label className="label">Payment Details</label>
        <div className="control">
          <div
            style={{
              padding: "10px",
              border: "1px solid #dbdbdb",
              borderRadius: "4px",
              backgroundColor: "#fafafa",
            }}
          >
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>
        </div>
      </div>

      <div className="field">
        <div className="box" style={{ backgroundColor: "#f5f5f5" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <span>Amount:</span>
            <span>${Number(payment.payment.amount).toFixed(2)}</span>
          </div>
          <div style={{ borderTop: "1px solid #ddd", paddingTop: "10px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "bold",
              }}
            >
              <span>Total:</span>
              <span>${Number(payment.payment.amount).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="notification is-danger">
          <button className="delete"></button>
          {error}
        </div>
      )}

      <div className="field is-grouped">
        <div className="control">
          <button
            type="button"
            onClick={handleSubmit}
            className={`button is-primary ${loading ? "is-loading" : ""}`}
            disabled={loading || !stripe}
          >
            Pay ${Number(payment.payment.amount).toFixed(2)}
          </button>
        </div>
      </div>

      <div
        className="has-text-grey-light is-size-7"
        style={{ marginTop: "10px" }}
      >
        This is a secure payment processed by Stripe. Your card information is
        never stored on our servers.
      </div>
    </div>
  );
};

PaymentForm.propTypes = {
  booking: PropTypes.shape({
    id: PropTypes.number.isRequired,
    total_amount: PropTypes.number.isRequired,
  }).isRequired,
  payment: PropTypes.shape({
    clientSecret: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
  }).isRequired,
  onPaymentSuccess: PropTypes.func,
  onPaymentError: PropTypes.func,
};

export default PaymentForm;
