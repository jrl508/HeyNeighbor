import React, { useState } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../hooks/useAuth";
import { useTool } from "../hooks/useTool";
import { createPaymentIntent, voidPayment } from "../api/payments";
import PaymentForm from "./PaymentForm";

const BookingModal = ({ tool, isOpen, onClose, onBooked }) => {
  const { state: authState } = useAuth();
  const { dispatch } = useTool();
  const [step, setStep] = useState("dates"); // 'dates' or 'payment'
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [deliveryRequired, setDeliveryRequired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);

  if (!isOpen) return null;

  const handleModalClose = async () => {
    // If we've already created a booking but haven't paid, ask for confirmation
    if (step === "payment" && booking) {
      const confirmCancel = window.confirm(
        "You have a pending booking. If you leave now, this request will be cancelled. Are you sure?"
      );
      
      if (!confirmCancel) return;

      // Clean up on backend
      try {
        const token = localStorage.getItem("token");
        await voidPayment(booking.id, token);
        console.log(`[BookingModal] Cleanup successful for booking ${booking.id}`);
      } catch (err) {
        console.error("[BookingModal] Cleanup failed:", err);
      }
    }
    
    // Reset state and call parent onClose
    setStep("dates");
    setBooking(null);
    setPayment(null);
    onClose();
  };

  const calculateDays = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    return Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleDatesSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      console.log(
        `[BookingModal] creating booking: tool=${tool.id} start=${startDate} end=${endDate}`,
      );

      // Create booking
      const res = await fetch(`${process.env.REACT_APP_API_URL}/bookings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tool_id: tool.id,
          start_date: startDate,
          end_date: endDate,
          delivery_required: deliveryRequired,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Booking failed");
      }

      const data = await res.json();
      console.log(`[BookingModal] booking created: ${data.booking.id}`);
      setBooking(data.booking);

      // Create payment intent
      console.log(`[BookingModal] creating payment intent`);
      const paymentRes = await createPaymentIntent(data.booking.id, token);

      if (!paymentRes.ok) {
        const errorData = await paymentRes.json();
        throw new Error(errorData.message || "Failed to create payment intent");
      }

      const paymentData = await paymentRes.json();
      console.log(
        `[BookingModal] payment intent created: ${paymentData.paymentIntentId}`,
      );
      setPayment(paymentData);
      setStep("payment");
    } catch (err) {
      console.error("[BookingModal] error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (data) => {
    console.log("[BookingModal] payment succeeded, booking confirmed");
    dispatch({ type: "ADD_BOOKING", payload: data.booking });
    onBooked && onBooked(data.booking);
    onClose();
  };

  const handlePaymentError = (err) => {
    console.error("[BookingModal] payment error:", err);
    setError(typeof err === "string" ? err : err.message || "Payment failed");
  };

  const handleBack = () => {
    setStep("dates");
    setPayment(null);
    setBooking(null);
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={handleModalClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">
            {step === "dates"
              ? `Book ${tool.name}`
              : `Payment for ${tool.name}`}
          </p>
          <button
            className="delete"
            aria-label="close"
            onClick={handleModalClose}
          ></button>
        </header>
        <section className="modal-card-body">
          {step === "dates" ? (
            <form onSubmit={handleDatesSubmit}>
              <div className="field">
                <label className="label">Start Date</label>
                <div className="control">
                  <input
                    type="date"
                    className="input"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">End Date</label>
                <div className="control">
                  <input
                    type="date"
                    className="input"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              {tool.deliveryAvailable && (
                <div className="field">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={deliveryRequired}
                      onChange={(e) => setDeliveryRequired(e.target.checked)}
                    />
                    <span className="ml-2">
                      Request Delivery (+${tool.delivery_fee} fee, pending owner approval)
                    </span>
                  </label>
                </div>
              )}

              {startDate && endDate && (
                <div className="notification is-info mt-4">
                  <p>
                    <strong>
                      Rental Duration: {calculateDays(startDate, endDate)} days
                    </strong>
                  </p>
                  <p>Daily Rate: ${tool.rental_price_per_day}</p>
                </div>
              )}

              {error && (
                <div className="notification is-danger">
                  <button className="delete"></button>
                  {error}
                </div>
              )}

              <div className="field is-grouped">
                <div className="control">
                  <button
                    className={`button is-primary ${
                      loading ? "is-loading" : ""
                    }`}
                    type="submit"
                    disabled={loading || !startDate || !endDate}
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            </form>
          ) : payment ? (
            <div>
              <div className="box" style={{ backgroundColor: "#f5f5f5" }}>
                <p>
                  <strong>Booking Summary</strong>
                </p>
                <div style={{ marginTop: "10px", fontSize: "14px" }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span>Duration:</span>
                    <span>{calculateDays(startDate, endDate)} days</span>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span>Daily Rate:</span>
                    <span>${tool.rental_price_per_day}</span>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span>Deposit (20%):</span>
                    <span>${(tool.rental_price_per_day * 0.2).toFixed(2)}</span>
                  </div>
                  {booking?.delivery_fee > 0 && (
                    <div
                      style={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <span>Delivery Fee:</span>
                      <span>${Number(booking.delivery_fee).toFixed(2)}</span>
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderTop: "1px solid #ddd",
                      paddingTop: "10px",
                      marginTop: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    <span>Total:</span>
                    <span>
                      ${Number(payment.payment.amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <PaymentForm
                booking={booking}
                payment={payment}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />

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
                    onClick={handleModalClose}
                    className="button is-light"
                  >
                    Cancel Request
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
};

BookingModal.propTypes = {
  tool: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onBooked: PropTypes.func,
};

export default BookingModal;
