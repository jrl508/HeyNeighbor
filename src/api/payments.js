const api = process.env.REACT_APP_API_URL;

// Create a Stripe PaymentIntent for a booking
export const createPaymentIntent = async (booking_id, token) => {
  const response = await fetch(`${api}/payments/intent`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      booking_id,
    }),
  });
  return response;
};

// Confirm payment after Stripe card processing
export const confirmPayment = async (
  booking_id,
  stripe_payment_intent_id,
  token,
) => {
  const response = await fetch(`${api}/payments/confirm`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      booking_id,
      stripe_payment_intent_id,
    }),
  });
  return response;
};

// Capture authorized payment (Owner action)
export const capturePayment = async (booking_id, token) => {
  const response = await fetch(`${api}/payments/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      booking_id,
    }),
  });
  return response;
};

// Void (cancel) authorized payment
export const voidPayment = async (booking_id, token) => {
  const response = await fetch(`${api}/payments/void`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      booking_id,
    }),
  });
  return response;
};
