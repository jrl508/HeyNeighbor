import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Icon from "@mdi/react";
import { mdiCalendarSync } from "@mdi/js";
import { rescheduleBooking } from "../api/bookings";

const RescheduleModal = ({ booking, isOpen, onClose, onSuccess }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [blockedDates, setBlockedDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (isOpen && booking) {
      fetchBlockedDates();
    }
  }, [isOpen, booking]);

  const fetchBlockedDates = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/tools/${booking.tool_id}/availability`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const ranges = await res.json();
        const dates = [];
        ranges.forEach(range => {
          // If the range belongs to THIS booking, don't block it for rescheduling
          if (range.notes && range.notes.includes(`Booking ID ${booking.id}`)) {
            return;
          }

          let current = new Date(range.start);
          const end = new Date(range.end);
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

  const handleReschedule = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) return;

    setLoading(true);
    setError("");
    try {
      const res = await rescheduleBooking(booking.id, {
        new_start_date: formatDate(startDate),
        new_end_date: formatDate(endDate)
      }, token);

      if (res.ok) {
        onSuccess && onSuccess();
        onClose();
      } else {
        const data = await res.json();
        setError(data.message || "Failed to request reschedule");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  if (!isOpen) return null;

  return (
    <div className={`modal ${isOpen ? "is-active" : ""}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Request Reschedule: {booking.tool_name}</p>
          <button className="delete" onClick={onClose}></button>
        </header>
        <section className="modal-card-body">
          <div className="notification is-info is-light">
            <p className="is-size-7">Current Dates: <strong>{booking.start_date} to {booking.end_date}</strong></p>
            <p className="is-size-7 mt-1">Select new dates below. The owner will need to approve this change.</p>
          </div>

          <div className="field is-flex is-justify-content-center">
            <DatePicker
              selected={startDate}
              onChange={onChange}
              startDate={startDate}
              endDate={endDate}
              excludeDates={blockedDates}
              selectsRange
              inline
              minDate={new Date()}
            />
          </div>

          {error && <div className="notification is-danger p-2 is-size-7 mt-3">{error}</div>}
        </section>
        <footer className="modal-card-foot">
          <button 
            className={`button is-primary ${loading ? "is-loading" : ""}`} 
            onClick={handleReschedule}
            disabled={!startDate || !endDate || loading}
          >
            <Icon path={mdiCalendarSync} size={0.8} className="mr-2" />
            Send Reschedule Request
          </button>
          <button className="button" onClick={onClose}>Cancel</button>
        </footer>
      </div>
    </div>
  );
};

RescheduleModal.propTypes = {
  booking: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func
};

export default RescheduleModal;
