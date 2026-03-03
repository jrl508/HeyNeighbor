import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiMessageText } from "@mdi/js";
import styles from "../../styles/Dashboard.module.css";
import { bookingsAPI, paymentsAPI } from "../../api";
import { sendMessage } from "../../api/messaging";
import { getReviewsForBooking } from "../../api/reviews";
import ReviewModal from "../../components/ReviewModal";
import ReviewButton from "../../components/ReviewButton";
import RescheduleModal from "../../components/RescheduleModal";
import { useAuth } from "../../hooks/useAuth";

const DashMain = () => {
  const { state } = useAuth();
  const { user } = state;
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [messageLoading, setMessageLoading] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewingBookingId, setReviewingBookingId] = useState(null);
  const [reviewingReviewedUserId, setReviewingReviewedUserId] = useState(null);
  const [reviewingReviewedUserName, setReviewingReviewedUserName] = useState(null);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [reschedulingBooking, setReschedulingBooking] = useState(null);
  const token = localStorage.getItem("token");

  const handleMessageUser = async (receiverId, toolName, bookingId) => {
    setMessageLoading(true);
    try {
      await sendMessage(
        {
          receiver_id: receiverId,
          booking_id: bookingId,
          content: `Hi! I have a question about the booking for ${toolName}.`,
        },
        token
      );
      navigate("/dashboard/inbox");
    } catch (err) {
      console.error("Error messaging user:", err);
      alert("Failed to send message. Please try again.");
    } finally {
      setMessageLoading(false);
    }
  };

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

  const handleRespondToReschedule = async (bookingId, action) => {
    try {
      const response = await bookingsAPI.respondToReschedule(bookingId, action, token);
      if (response.ok) {
        fetchBookings();
      } else {
        const data = await response.json();
        alert(data.message || `Failed to ${action} reschedule request`);
      }
    } catch (err) {
      console.error(`Error ${action}ing reschedule request:`, err);
    }
  };

  const canMessage = (booking) => {
    const { status, completed_at, updated_at } = booking;
    
    // If it's an open booking, always allow messaging
    if (!["completed", "cancelled"].includes(status)) {
      return true;
    }

    // For completed/cancelled, allow a 48-hour grace period
    const lastActiveDate = new Date(completed_at || updated_at);
    const now = new Date();
    const fortyEightHoursInMs = 48 * 60 * 60 * 1000;

    return now - lastActiveDate < fortyEightHoursInMs;
  };

  const openReviewModal = (bookingId, reviewedUserId, reviewedUserName) => {
    setReviewingBookingId(bookingId);
    setReviewingReviewedUserId(reviewedUserId);
    setReviewingReviewedUserName(reviewedUserName);
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setReviewingBookingId(null);
    setReviewingReviewedUserId(null);
    setReviewingReviewedUserName(null);
  };

  const handleReviewSubmitted = () => {
    fetchBookings(); // Refresh bookings to update review status
    closeReviewModal();
  };

  const openRescheduleModal = (booking) => {
    setReschedulingBooking(booking);
    setIsRescheduleModalOpen(true);
  };

  const handleRescheduleSuccess = () => {
    fetchBookings();
    setIsRescheduleModalOpen(false);
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
                        {booking.status === "reschedule_pending" && (
                          <div className="mt-1">
                            <span className="is-size-7 has-text-info is-italic">
                              Requested Reschedule: <strong>{booking.new_start_date} to {booking.new_end_date}</strong> (Pending approval)
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="has-text-right">
                        <span className={`tag ${getStatusColor(booking.status)}`}>
                          {booking.status.toUpperCase().replace('_', ' ')}
                        </span>
                        <br />
                        <span className="is-size-7 has-text-grey">
                          Payment: {booking.payment_status || 'pending'}
                        </span>
                        <div className="mt-2 buttons is-right">
                          {canMessage(booking) && (
                            <button
                              className={`button is-small is-info is-light ${
                                messageLoading ? "is-loading" : ""
                              }`}
                              onClick={() =>
                                handleMessageUser(
                                  booking.owner_id,
                                  booking.tool_name,
                                  booking.id
                                )
                              }
                              disabled={messageLoading}
                            >
                              <Icon path={mdiMessageText} size={0.6} className="mr-1" />
                              Message Owner
                            </button>
                          )}
                          {booking.status === "confirmed" && (
                            <button
                              className="button is-small is-primary is-outlined"
                              onClick={() => openRescheduleModal(booking)}
                            >
                              Request Reschedule
                            </button>
                          )}
                          {booking.status === "active" && (
                            <button
                              className="button is-small is-info is-outlined"
                              onClick={() => handleReturn(booking.id)}
                            >
                              Mark as Returned
                            </button>
                          )}
                          {booking.status === "completed" && (
                            <ReviewButton
                              booking={booking}
                              reviewerId={user.id}
                              reviewedId={booking.owner_id}
                              reviewedName={booking.owner_first_name}
                              openReviewModal={openReviewModal}
                              token={token}
                              key={`renter-review-${booking.id}`}
                            />
                          )}
                          {booking.status === "pending_payment" && (
                            <button
                              className="button is-small is-danger is-outlined"
                              onClick={() => handleVoid(booking.id)}
                            >
                              Cancel Request
                            </button>
                          )}
                        </div>
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
                      <div className="buttons is-right">
                        {canMessage(booking) && (
                          <button
                            className={`button is-small is-info is-light ${
                              messageLoading ? "is-loading" : ""
                            }`}
                            onClick={() =>
                              handleMessageUser(
                                booking.renter_id,
                                booking.tool_name,
                                booking.id
                              )
                            }
                            disabled={messageLoading}
                          >
                            <Icon path={mdiMessageText} size={0.6} className="mr-1" />
                            Message Renter
                          </button>
                        )}

                        {booking.status === "reschedule_pending" && (
                          <>
                            <div className="notification is-info is-light is-size-7 p-2 mb-0 mr-2">
                              New Proposed Dates: <strong>{booking.new_start_date} to {booking.new_end_date}</strong>
                            </div>
                            <button
                              className="button is-small is-success"
                              onClick={() => handleRespondToReschedule(booking.id, 'accept')}
                            >
                              Accept Change
                            </button>
                            <button
                              className="button is-small is-danger is-light"
                              onClick={() => handleRespondToReschedule(booking.id, 'decline')}
                            >
                              Decline
                            </button>
                          </>
                        )}

                        {booking.status === "requested" &&
                        booking.delivery_status === "requested" ? (
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

                        {booking.status === "completed" && (
                          <ReviewButton
                            booking={booking}
                            reviewerId={user.id}
                            reviewedId={booking.renter_id}
                            reviewedName={booking.renter_first_name}
                            openReviewModal={openReviewModal}
                            token={token}
                            key={`owner-review-${booking.id}`}
                          />
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
            {myToolsRented.filter(b => b.status === 'reschedule_pending').map(b => (
              <div key={b.id} className="notification is-warning is-light is-size-7 p-2 mb-2">
                <strong>{b.renter_first_name}</strong> wants to reschedule <strong>{b.tool_name}</strong>.
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
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={closeReviewModal}
        bookingId={reviewingBookingId}
        reviewedUserId={reviewingReviewedUserId}
        reviewedUserName={reviewingReviewedUserName}
        onReviewSubmitted={handleReviewSubmitted}
      />
      {isRescheduleModalOpen && reschedulingBooking && (
        <RescheduleModal
          isOpen={isRescheduleModalOpen}
          booking={reschedulingBooking}
          onClose={() => setIsRescheduleModalOpen(false)}
          onSuccess={handleRescheduleSuccess}
        />
      )}
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
    case 'reschedule_pending': return 'is-info is-light';
    default: return 'is-light';
  }
};

export default DashMain;
