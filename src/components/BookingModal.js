import React, { useState } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../hooks/useAuth";
import { useTool } from "../hooks/useTool";

const BookingModal = ({ tool, isOpen, onClose, onBooked }) => {
  const { state: authState } = useAuth();
  const { dispatch } = useTool();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Example API call, replace with actual endpoint
      const token = localStorage.getItem("token");
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
          delivery_required: false,
        }),
      });
      if (!res.ok) throw new Error("Booking failed");
      const booking = await res.json();
      dispatch({ type: "ADD_BOOKING", payload: booking });
      onBooked && onBooked(booking);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Book {tool.name}</p>
          <button
            className="delete"
            aria-label="close"
            onClick={onClose}
          ></button>
        </header>
        <section className="modal-card-body">
          <form onSubmit={handleSubmit}>
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
            {error && <p className="has-text-danger">{error}</p>}
            <button
              className="button is-primary"
              type="submit"
              disabled={loading}
            >
              Book
            </button>
          </form>
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
