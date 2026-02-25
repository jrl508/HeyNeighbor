import React, { useEffect, useState } from "react";
import styles from "../../styles/Dashboard.module.css";
import { bookingsAPI, paymentsAPI } from "../../api";
import { useAuth } from "../../hooks/useAuth";

const DashMain = () => {
  const { state } = useAuth();
  const { user } = state;
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await bookingsAPI.getBookings(token);
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else {
        setError("Failed to fetch bookings");
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("An error occurred while fetching bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchBookings();
    }
  }, [token]);

  const handleCapture = async (bookingId) => {
    try {
      const response = await paymentsAPI.capturePayment(bookingId, token);
      if (response.ok) {
        fetchBookings(); // Refresh list
      } else {
        const data = await response.json();
        alert(data.message || "Failed to capture payment");
      }
    } catch (err) {
      console.error("Error capturing payment:", err);
      alert("An error occurred while capturing payment");
    }
  };

  const handleVoid = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking and release the funds?")) return;
    try {
      const response = await paymentsAPI.voidPayment(bookingId, token);
      if (response.ok) {
        // Also cancel the booking record if it hasn't been already
        await bookingsAPI.cancelBooking(bookingId, "Cancelled via dashboard", token);
        fetchBookings(); // Refresh list
      } else {
        const data = await response.json();
        alert(data.message || "Failed to void payment");
      }
    } catch (err) {
      console.error("Error voiding payment:", err);
      alert("An error occurred while voiding payment");
    }
  };

  const handleConfirmBooking = async (bookingId) => {
    try {
      const response = await bookingsAPI.confirmBooking(bookingId, token);
      if (response.ok) {
        fetchBookings();
      }
    } catch (err) {
      console.error("Error confirming booking:", err);
    }
  };

  if (loading) return <div className="p-5">Loading your dashboard...</div>;

  const myRentals = bookings.filter(b => b.renter_id === user.id);
  const myToolsRented = bookings.filter(b => b.owner_id === user.id);

  return (
    <div style={{ display: "flex", gap: "25px", flexFlow: "row wrap" }}>
      <div className={styles.center} style={{ flex: "1 1 60%" }}>
        <div style={{ width: "100%" }}>
          <div className="title is-5" style={{ margin: "0 0 1em" }}>
            My Tool Rentals (Renting from others)
          </div>
          <div className={styles.card}>
            {myRentals.length === 0 ? (
              <div className="p-4">You haven't rented any tools yet.</div>
            ) : (
              <ul>
                {myRentals.map(booking => (
                  <li key={booking.id} style={{ borderBottom: "1px solid lightgray" }}>
                    <div className="is-flex is-justify-content-space-between">
                      <div>
                        <strong>{booking.tool_name}</strong> (Owner: {booking.owner_first_name})
                        <br />
                        <span className="is-size-7 has-text-grey">
                          {booking.start_date} to {booking.end_date}
                        </span>
                      </div>
                      <div className="has-text-right">
                        <span className={`tag ${getStatusColor(booking.status)}`}>
                          {booking.status.toUpperCase()}
                        </span>
                        <br />
                        <span className="is-size-7 has-text-grey">
                          Payment: {booking.payment_status || 'pending'}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="title is-5" style={{ margin: "2em 0 1em" }}>
            My Listings (Rented by others)
          </div>
          <div className={styles.card}>
            {myToolsRented.length === 0 ? (
              <div className="p-4">None of your tools are currently requested or rented.</div>
            ) : (
              <ul>
                {myToolsRented.map(booking => (
                  <li key={booking.id} style={{ borderBottom: "1px solid lightgray" }}>
                    <div className="is-flex is-justify-content-space-between is-align-items-center">
                      <div>
                        <strong>{booking.tool_name}</strong> (Renter: {booking.renter_first_name})
                        <br />
                        <span className="is-size-7 has-text-grey">
                          {booking.start_date} to {booking.end_date}
                        </span>
                        <br />
                        <span className="is-size-7">
                          Payment Status: <strong>{booking.payment_status}</strong>
                        </span>
                      </div>
                      <div className="buttons">
                        {booking.status === 'requested' && (
                          <button 
                            className="button is-small is-success"
                            onClick={() => handleConfirmBooking(booking.id)}
                          >
                            Confirm Booking
                          </button>
                        )}
                        
                        {booking.payment_status === 'authorized' && (
                          <button 
                            className="button is-small is-link"
                            onClick={() => handleCapture(booking.id)}
                            title="Capture funds once tool is returned"
                          >
                            Capture Payment
                          </button>
                        )}

                        {['requested', 'confirmed'].includes(booking.status) && (
                          <button 
                            className="button is-small is-danger is-outlined"
                            onClick={() => handleVoid(booking.id)}
                          >
                            Cancel/Void
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className={styles.right} style={{ flex: "1 1 30%" }}>
        <div className="title is-5" style={{ margin: "0 0 1em" }}>
          Notification Center
        </div>
        <div className={styles.card}>
          <div className="p-4">
            <p className="is-size-7 has-text-grey mb-3">Recent activity will appear here.</p>
            {myToolsRented.filter(b => b.status === 'requested').map(b => (
              <div key={b.id} className="notification is-info is-light is-size-7 p-2 mb-2">
                New request for <strong>{b.tool_name}</strong> from {b.renter_first_name}.
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'requested': return 'is-warning is-light';
    case 'confirmed': return 'is-info is-light';
    case 'active': return 'is-primary';
    case 'completed': return 'is-success';
    case 'cancelled': return 'is-danger is-light';
    default: return 'is-light';
  }
};

export default DashMain;
