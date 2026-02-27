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

  const handleComplete = async (bookingId) => {
    try {
      const response = await bookingsAPI.completeBooking(bookingId, token);
      if (response.ok) {
        fetchBookings(); // Refresh list
      } else {
        const data = await response.json();
        alert(data.message || "Failed to complete booking");
      }
    } catch (err) {
      console.error("Error completing booking:", err);
      alert("An error occurred while completing the booking");
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

  const handleConfirmBooking = async (bookingId, deliveryDecision) => {
    try {
      const response = await bookingsAPI.confirmBooking(bookingId, deliveryDecision, token);
      if (response.ok) {
        fetchBookings();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to confirm booking");
      }
    } catch (err) {
      console.error("Error confirming booking:", err);
      alert("An error occurred while confirming the booking.");
    }
  };

  const isPastEndDate = (endDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    return end < today;
  };

  const handleActivate = async (bookingId) => {
    try {
      const response = await bookingsAPI.activateBooking(bookingId, token);
      if (response.ok) {
        fetchBookings();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to activate rental");
      }
    } catch (err) {
      console.error("Error activating rental:", err);
    }
  };

  const handleReturn = async (bookingId) => {
    try {
      const response = await bookingsAPI.returnBooking(bookingId, token);
      if (response.ok) {
        fetchBookings();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to mark as returned");
      }
    } catch (err) {
      console.error("Error returning tool:", err);
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
                        {booking.status === 'active' && (
                          <div className="mt-2">
                            <button 
                              className="button is-small is-info is-outlined"
                              onClick={() => handleReturn(booking.id)}
                            >
                              Mark as Returned
                            </button>
                          </div>
                        )}
                        {booking.status === 'pending_payment' && (
                          <div className="mt-2">
                            <button 
                              className="button is-small is-danger is-outlined"
                              onClick={() => handleVoid(booking.id)}
                            >
                              Cancel Request
                            </button>
                          </div>
                        )}
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
                        {booking.status === 'requested' && booking.delivery_status === 'requested' ? (
                          <>
                            <button
                              className="button is-small is-success"
                              onClick={() => handleConfirmBooking(booking.id, 'accept')}
                            >
                              Accept with Delivery
                            </button>
                            <button
                              className="button is-small is-info"
                              onClick={() => handleConfirmBooking(booking.id, 'reject')}
                            >
                              Accept (Pickup Only)
                            </button>
                          </>
                        ) : booking.status === 'requested' ? (
                          <button 
                            className="button is-small is-success"
                            onClick={() => handleConfirmBooking(booking.id, 'accept')}
                          >
                            Confirm Booking
                          </button>
                        ) : null}

                        {booking.status === 'confirmed' && (
                          <button 
                            className="button is-small is-info"
                            onClick={() => handleActivate(booking.id)}
                            title="Mark tool as handed over to renter"
                          >
                            Mark Handed Over
                          </button>
                        )}
                        
                        {booking.status === 'active' && (
                          <div className="is-flex is-align-items-center">
                            <span className="is-size-7 has-text-grey-light is-italic mr-2">
                              Rental in progress...
                            </span>
                            {isPastEndDate(booking.end_date) && (
                              <button 
                                className="button is-small is-danger is-light"
                                onClick={() => handleComplete(booking.id)}
                                title="Renter has not marked as returned, but the end date has passed. You can force completion."
                              >
                                Force Complete
                              </button>
                            )}
                          </div>
                        )}

                        {booking.status === 'returning' && (
                          <button 
                            className="button is-small is-success"
                            onClick={() => handleComplete(booking.id)}
                            title="Renter has returned the tool. Confirm receipt and finalize."
                          >
                            Confirm Return & Complete
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
            {myToolsRented.filter(b => b.status === 'returning').map(b => (
              <div key={b.id} className="notification is-success is-light is-size-7 p-2 mb-2">
                <strong>{b.renter_first_name}</strong> has returned <strong>{b.tool_name}</strong>. Please confirm receipt.
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
    case 'pending_payment': return 'is-light';
    case 'requested': return 'is-warning is-light';
    case 'confirmed': return 'is-info is-light';
    case 'active': return 'is-primary';
    case 'returning': return 'is-info';
    case 'completed': return 'is-success';
    case 'cancelled': return 'is-danger is-light';
    default: return 'is-light';
  }
};

export default DashMain;
