import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Icon from "@mdi/react";
import { mdiMessageText, mdiCalendar } from "@mdi/js";
import { useAuth } from "../hooks/useAuth";
import { useTool } from "../hooks/useTool";
import { createPaymentIntent, voidPayment } from "../api/payments";
import { sendMessage } from "../api/messaging";
import PaymentForm from "./PaymentForm";

const BookingModal = ({ tool, isOpen, onClose, onBooked }) => {
  const { state: authState } = useAuth();
  const { dispatch } = useTool();
  const navigate = useNavigate();
  const [step, setStep] = useState("dates"); // 'dates' or 'payment'
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [blockedDates, setBlockedDates] = useState([]);
  const [deliveryRequired, setDeliveryRequired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    if (isOpen && tool) {
      fetchBlockedDates();
    }
  }, [isOpen, tool]);

  const fetchBlockedDates = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.REACT_APP_API_URL}/tools/${tool.id}/availability`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const ranges = await res.json();
        const dates = [];
        ranges.forEach(range => {
          let current = new Date(range.start);
          const end = new Date(range.end);
          // Normalize to midnight local time to avoid TZ issues
          current.setHours(0, 0, 0, 0);
          end.setHours(0, 0, 0, 0);

          while (current <= end) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
          }
        });
        setBlockedDates(dates);
      }
    } catch (err) {
      console.error("Error fetching blocked dates:", err);
    }
  };

  if (!isOpen) return null;

  const handleMessageOwner = async () => {
    setMessageLoading(true);
    try {
      const token = localStorage.getItem("token");
      await sendMessage(
        {
          receiver_id: tool.user_id,
          content: `Hi! I have a question about booking your ${tool.name}.`,
        },
        token
      );
      onClose();
      navigate("/dashboard/inbox");
    } catch (err) {
      console.error("Error messaging owner:", err);
      setError("Failed to send message.");
    } finally {
      setMessageLoading(false);
    }
  };

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
    setStartDate(null);
    setEndDate(null);
    setBooking(null);
    setPayment(null);
    onClose();
  };

  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    s.setHours(0, 0, 0, 0);
    e.setHours(0, 0, 0, 0);
    return Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  const handleDatesSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) return;

    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const startStr = formatDate(startDate);
      const endStr = formatDate(endDate);

      console.log(
        `[BookingModal] creating booking: tool=${tool.id} start=${startStr} end=${endStr}`,
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
          start_date: startStr,
          end_date: endStr,
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

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div className={`modal ${isOpen ? "is-active" : ""}`}>
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
                <label className="label">Select Dates</label>
                <div className="control has-icons-left">
                  <DatePicker
                    selected={startDate}
                    onChange={onChange}
                    startDate={startDate}
                    endDate={endDate}
                    excludeDates={blockedDates}
                    selectsRange
                    inline
                    minDate={new Date()}
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
                  <p>Estimated Total: ${(calculateDays(startDate, endDate) * tool.rental_price_per_day).toFixed(2)}</p>
                </div>
              )}

              {error && (
                <div className="notification is-danger">
                  <button className="delete" onClick={() => setError("")}></button>
                  {error}
                </div>
              )}

              <div className="field is-grouped mt-5">
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
                <div className="control">
                  <button
                    type="button"
                    className={`button is-info is-light ${
                      messageLoading ? "is-loading" : ""
                    }`}
                    onClick={handleMessageOwner}
                    disabled={messageLoading}
                  >
                    <Icon path={mdiMessageText} size={0.8} className="mr-2" />
                    Message Owner
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
                  <button className="delete" onClick={() => setError("")}></button>
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
